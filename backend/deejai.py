"""Playlist generation using Deep Learning models.
"""
import os
import re
import uuid
import pickle
import random
import shutil
import logging
from pathlib import Path
from io import BytesIO

import librosa
import requests
import numpy as np
from starlette.concurrency import run_in_threadpool
from unidecode import unidecode

# can't get tensorflow to work on Hackintosh due to missing AVX support
if 'HACKINTOSH' not in os.environ:
    import tensorflow as tf
    from keras.models import load_model


class DeejAI:
    """Playlist generation class.
    """
    N_FFT = 2048
    HOP_LENGTH = 512
    MODEL_DIR = Path('model')

    @staticmethod
    def _normalize_vectors(vectors):
        """Normalize non-zero vectors in a mapping."""
        return {
            k: v / np.linalg.norm(v)
            for k, v in vectors.items() if np.linalg.norm(v) > 0
        }

    @staticmethod
    def _normalize_array(vectors):
        """Normalize an embedding matrix without changing zero rows."""
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        return vectors / np.maximum(norms, 1e-8)

    @classmethod
    def _load_vector_store(cls, name, legacy_pickle=None, mmap=True):
        """Load an embedding store as IDs plus a row-aligned matrix."""
        ids_path = cls.MODEL_DIR / f'{name}_ids.npy'
        vectors_path = cls.MODEL_DIR / f'{name}_vectors.npy'
        if ids_path.exists() and vectors_path.exists():
            mmap_mode = 'r' if mmap else None
            ids = np.load(ids_path, allow_pickle=False)
            vectors = np.load(vectors_path,
                              allow_pickle=False,
                              mmap_mode=mmap_mode)
            return ids.astype(str), vectors

        npz_path = cls.MODEL_DIR / f'{name}.npz'
        if os.path.exists(npz_path):
            with np.load(npz_path, allow_pickle=False) as data:
                track_ids = data['track_ids'].astype(str)
                vectors = data['embeddings'].astype(np.float32, copy=False)
                return track_ids, vectors

        legacy_npz_path = cls.MODEL_DIR / 'embeddings.npz'
        if os.path.exists(legacy_npz_path):
            with np.load(legacy_npz_path, allow_pickle=False) as data:
                track_ids = data['track_ids'].astype(str)
                vectors = data['embeddings'].astype(np.float32, copy=False)
                return track_ids, vectors

        if legacy_pickle is None:
            legacy_pickle = cls.MODEL_DIR / f'{name}.p'
        else:
            legacy_pickle = Path(legacy_pickle)

        if not legacy_pickle.exists() and name == 'jepa':
            legacy_pickle = cls.MODEL_DIR / 'embeddings.npy'

        if legacy_pickle.suffix == '.npy':
            data = np.load(legacy_pickle, allow_pickle=True).item()
        else:
            with legacy_pickle.open('rb') as file:
                data = pickle.load(file)
        ids = np.asarray(list(data), dtype=str)
        vectors = np.stack([data[track_id]
                            for track_id in ids]).astype(np.float32,
                                                         copy=False)
        vectors = cls._normalize_array(vectors).astype(np.float32, copy=False)
        return ids, vectors

    @staticmethod
    def _choose_candidate(candidates, noise):
        """Choose from scored candidates using `noise` as temperature."""
        if noise <= 0:
            return candidates[0][0]
        k = min(len(candidates), max(2, int(1 + noise * 25)))
        weights = np.array([score for _, score in candidates[:k]],
                           dtype=np.float64)
        weights = np.exp((weights - weights.max()) / max(noise, 1e-6))
        weights = weights / weights.sum()
        return candidates[int(np.random.choice(k, p=weights))][0]

    @staticmethod
    def _aligned_vectors(source_ids, source_vectors, target_ids):
        """Return vectors ordered like target_ids, avoiding copies when possible."""
        if len(source_ids) == len(target_ids) and np.array_equal(
                source_ids, target_ids):
            return source_vectors

        indices = {track_id: index for index, track_id in enumerate(source_ids)}
        return source_vectors[[indices[track_id] for track_id in target_ids]]

    @classmethod
    def _load_aligned_vectors(cls, name, expected_rows):
        """Load vectors already aligned to the active track ID order."""
        path = cls.MODEL_DIR / f'{name}_vectors.npy'
        if not path.exists():
            return None
        vectors = np.load(path, allow_pickle=False, mmap_mode='r')
        if vectors.shape[0] != expected_rows:
            return None
        return vectors

    @staticmethod
    def _valid_candidate(track_id, tracks, playlist, playlist_tracks,
                         blocked_ids):
        """Check playlist-level duplicate and artist constraints."""
        if track_id in blocked_ids or tracks[track_id] in playlist_tracks:
            return False
        last_track = tracks[playlist[-1]]
        track = tracks[track_id]
        return track[:track.find(' - ')] != last_track[:last_track.find(' - ')]

    def _candidate_pool(self, ranked, scores, playlist, playlist_tracks,
                        blocked_ids, noise):
        """Collect only as many valid ranked candidates as temperature can use."""
        needed = 1 if noise <= 0 else max(2, int(1 + noise * 25))
        pool = []
        for candidate in ranked:
            track_id = self.track_ids[int(candidate)]
            if self._valid_candidate(track_id, self.tracks, playlist,
                                     playlist_tracks, blocked_ids):
                pool.append((int(candidate), scores[int(candidate)]))
                if len(pool) >= needed:
                    break
        return pool

    def __init__(self):
        self.embeddings_model = os.environ.get('EMBEDDINGS_MODEL',
                                               'jepa').lower()
        with open(os.path.join('model', 'spotify_tracks.p'), 'rb') as file:
            self.tracks = pickle.load(file)
        with open(os.path.join('model', 'spotify_urls.p'), 'rb') as file:
            self.urls = pickle.load(file)

        self.model = None
        self.audio_vecs = None

        use_audio_model = 'HACKINTOSH' not in os.environ

        if self.embeddings_model == 'jepa':
            logging.info('Loading JEPA embeddings as primary channel')
            primary_ids, primary_vecs = self._load_vector_store(
                'jepa', legacy_pickle=self.MODEL_DIR / 'jepa.npy')
            self.track_ids = [str(track_id) for track_id in primary_ids]
            track_arr = self._load_aligned_vectors('jepa_tracktovec',
                                                   len(self.track_ids))
            if track_arr is None:
                track_ids, track_vecs = self._load_vector_store(
                    'tracktovec',
                    legacy_pickle=self.MODEL_DIR / 'tracktovec.p')
                track_id_set = set(track_ids)
                self.track_ids = [
                    track_id for track_id in self.track_ids
                    if track_id in track_id_set
                ]
                track_arr = self._aligned_vectors(track_ids, track_vecs,
                                                  self.track_ids)
        else:
            track_ids, track_vecs = self._load_vector_store(
                'tracktovec', legacy_pickle=self.MODEL_DIR / 'tracktovec.p')
            primary_ids, primary_vecs = self._load_vector_store(
                'spotifytovec',
                legacy_pickle=self.MODEL_DIR / 'spotifytovec.p')
            track_id_set = set(track_ids)
            self.track_ids = [
                str(track_id) for track_id in primary_ids
                if track_id in track_id_set
            ]
            track_arr = self._aligned_vectors(track_ids, track_vecs,
                                              self.track_ids)

        self.track_indices = {k: i for i, k in enumerate(self.track_ids)}

        # Two parallel arrays — one per channel — so that channels with
        # different embedding dimensions (e.g. 384-d JEPA + 100-d tracktovec)
        # can be blended via the `creativity` weight in `most_similar`.
        primary_arr = self._aligned_vectors(primary_ids, primary_vecs,
                                            self.track_ids)
        self.mp3tovecs = [primary_arr, track_arr]
        if self.embeddings_model != 'jepa':
            self.audio_vecs = primary_arr  # same data as channel 0
        elif use_audio_model:
            self.audio_vecs = self._load_aligned_vectors(
                'jepa_spotifytovec', len(self.track_ids))
            if self.audio_vecs is None:
                audio_ids, audio_vecs = self._load_vector_store(
                    'spotifytovec',
                    legacy_pickle=self.MODEL_DIR / 'spotifytovec.p')
                self.audio_vecs = self._aligned_vectors(
                    audio_ids, audio_vecs, self.track_ids)

        self.preprocessed_tracks = {
            track_id: re.sub(r'([^\s\w]|_)+', '', unidecode(track).lower())
            for track_id, track in self.tracks.items()
            if track_id in self.track_indices
        }

        if use_audio_model:
            self.model = load_model(
                os.path.join('model', 'speccy_model'),
                custom_objects={
                    'cosine_proximity':
                    tf.compat.v1.keras.losses.cosine_proximity
                })

        del primary_ids, primary_vecs, primary_arr, track_arr

    def get_tracks(self):
        """Get tracks.

        Returns:
            dict: Tracks.
        """
        return self.tracks

    async def search(self, string, max_items=250):
        """Find all tracks with artist or title containing all words in string.

        Args:
            string (str): Search string.
            max_items (int, optional): Maximum number of tracks to return. Defaults to 250.
        """

        def _search():
            search_string = set(
                re.sub(r'([^\s\w]|_)+', '', unidecode(string).lower()).split())
            ids = sorted([
                track for track, preprocessed_track in
                self.preprocessed_tracks.items()
                if all(word in preprocessed_track for word in search_string)
            ],
                         key=lambda x: self.tracks[x])[:max_items]
            return ids

        return await run_in_threadpool(_search)

    async def playlist(self, track_ids, size, creativity, noise):
        """Generate playlist.

        Args:
            track_ids (list): Waypoints to include.
            size (int): Number of tracks to add between waypoints.
            creativity (float): Creativity (between 0 and 1 inclusive).
            noise (float): Noise (between 0 and 1 inclusive).

        Returns:
            list: Track IDs.
        """
        if len(track_ids) == 0:
            track_ids = [random.choice(self.track_ids)]
        elif len(track_ids) > 1:
            return await self.join_the_dots([creativity, 1 - creativity],
                                            track_ids,
                                            size=size,
                                            noise=noise)
        return await self.make_playlist([creativity, 1 - creativity],
                                        track_ids,
                                        size=size,
                                        noise=noise)

    async def most_similar(  # pylint: disable=too-many-arguments,unused-argument
            self,
            mp3tovecs,
            weights,
            positive=iter(()),
            negative=iter(()),
            noise=0,
            vecs=None,
            return_scores=False):
        """Most similar IDs.

        `mp3tovecs` is a list of per-channel arrays, each of shape (N, dim_j).
        Channels may have different embedding dimensions.
        """
        positive = list(positive)
        negative = list(negative)
        n_tracks = mp3tovecs[0].shape[0]
        scores = np.zeros(n_tracks, dtype=np.float32)
        for j, weight in enumerate(weights):
            channel = mp3tovecs[j]
            target = np.zeros(channel.shape[1], dtype=np.float32)
            if positive:
                target += np.sum(channel[positive], axis=0)
            if negative:
                target -= np.sum(channel[negative], axis=0)
            if vecs is not None:
                target += np.sum([v[j] for v in vecs], axis=0)
            scores += weight * (channel @ target)
        result = np.argsort(scores)[::-1]
        excluded = set(positive + negative)
        if excluded:
            result = result[~np.isin(result, list(excluded))]
        if return_scores:
            return result, scores
        return result.tolist()

    async def most_similar_by_vec(  # pylint: disable=too-many-arguments,unused-argument
            self,
            mp3tovecs,
            weights,
            positives=iter(()),
            negatives=iter(()),
            noise=0,
            return_scores=False):
        """Most similar IDs by vector.

        `mp3tovecs` is a list of per-channel arrays. `positives` / `negatives`
        are lists per channel of vectors with matching channel dimension.
        """
        positives = list(positives) if positives else []
        negatives = list(negatives) if negatives else []
        n_tracks = mp3tovecs[0].shape[0]
        scores = np.zeros(n_tracks, dtype=np.float32)
        for j, weight in enumerate(weights):
            channel = mp3tovecs[j]
            target = np.zeros(channel.shape[1], dtype=np.float32)
            if positives:
                target += np.sum(positives[j], axis=0)
            if negatives:
                target -= np.sum(negatives[j], axis=0)
            scores += weight * (channel @ target)
        result = np.argsort(-scores)
        if return_scores:
            return result, scores
        return result.tolist()

    def _track_vec(self, idx):
        """Per-channel vectors for a track index: list of arrays, one per channel."""
        return [channel[idx] for channel in self.mp3tovecs]

    async def join_the_dots(self, weights, ids, size=5, noise=0):
        """Generate playlist that joins the dots between given waypoints.
        """
        playlist = []
        playlist_tracks = {self.tracks[_] for _ in ids}
        blocked_ids = set(ids)
        end = start = ids[0]
        start_vec = self._track_vec(self.track_indices[start])
        for end in ids[1:]:
            end_vec = self._track_vec(self.track_indices[end])
            playlist.append(start)
            for i in range(size):
                candidates = await self.most_similar_by_vec(
                    self.mp3tovecs,
                    weights, [[(size - i) / (size + 1) * start_vec[k] +
                               (i + 1) / (size + 1) * end_vec[k]]
                              for k in range(len(weights))],
                    noise=noise,
                    return_scores=True)
                ranked, scores = candidates
                candidate = self._choose_candidate(
                    self._candidate_pool(ranked, scores, playlist,
                                         playlist_tracks, blocked_ids, noise),
                    noise)
                track_id = self.track_ids[candidate]
                playlist.append(track_id)
                playlist_tracks.add(self.tracks[track_id])
                blocked_ids.add(track_id)
            start = end
            start_vec = end_vec
        playlist.append(end)
        return playlist

    async def make_playlist(  # pylint: disable=too-many-arguments
            self,
            weights,
            playlist,
            size=10,
            lookback=3,
            noise=0):
        """Generate playlist starting from seed track(s).
        """
        playlist_tracks = {self.tracks[_] for _ in playlist}
        blocked_ids = set(playlist)
        playlist_indices = [self.track_indices[_] for _ in playlist]
        for _ in range(len(playlist), size):
            candidates = await self.most_similar(
                self.mp3tovecs,
                weights,
                positive=playlist_indices[-lookback:],
                noise=noise,
                return_scores=True)
            ranked, scores = candidates
            candidate = self._choose_candidate(
                self._candidate_pool(ranked, scores, playlist,
                                     playlist_tracks, blocked_ids, noise),
                noise)
            track_id = self.track_ids[candidate]
            playlist.append(track_id)
            playlist_tracks.add(self.tracks[track_id])
            blocked_ids.add(track_id)
            playlist_indices.append(candidate)  # pylint: disable=undefined-loop-variable
        return playlist

    async def get_similar_vec(self, track_url, max_items=10):
        """Most similar to MP3 given by URL.

        Compares against `self.audio_vecs` (the spotifytovec / mp3tovec
        space) regardless of `EMBEDDINGS_MODEL`, since speccy_model produces
        embeddings in that space.
        """
        if self.model is None or self.audio_vecs is None:
            return []

        def _get_similar_vec():
            y, sr = librosa.load(f'{playlist_id}.{extension}', mono=True)
            os.remove(f'{playlist_id}.{extension}')
            S = librosa.feature.melspectrogram(y=y,
                                               sr=sr,
                                               n_fft=self.N_FFT,
                                               hop_length=self.HOP_LENGTH,
                                               n_mels=n_mels,
                                               fmax=sr / 2)
            x = np.ndarray(shape=(S.shape[1] // slice_size, n_mels, slice_size,
                                  1),
                           dtype=float)
            for slice_ in range(S.shape[1] // slice_size):
                log_S = librosa.power_to_db(
                    S[:, slice_ * slice_size:(slice_ + 1) * slice_size],
                    ref=float(self.N_FFT // 2))
                if np.max(log_S) - np.min(log_S) != 0:
                    log_S = (log_S - np.min(log_S)) / (np.max(log_S) -
                                                       np.min(log_S))
                x[slice_, :, :, 0] = log_S
            return self.model.predict(x)

        playlist_id = str(uuid.uuid4())
        n_mels = self.model.inputs[0].shape[1]
        slice_size = self.model.inputs[0].shape[2]

        try:
            response = requests.get(track_url, allow_redirects=True)
            if response.status_code != 200:
                return []
            extension = 'wav' if 'wav' in response.headers[
                'Content-Type'] else 'mp3'
            with open(f'{playlist_id}.{extension}',
                      'wb') as file:  # This is really annoying!
                shutil.copyfileobj(BytesIO(response.content),
                                   file,
                                   length=131072)
            vecs = await run_in_threadpool(_get_similar_vec)
            candidates = await self.most_similar_by_vec(
                [self.audio_vecs], [1], [vecs])
            ids = [
                self.track_ids[candidate]
                for candidate in candidates[0:max_items]
            ]
            return ids
        except Exception as error:  # pylint: disable=broad-except
            logging.error(error)
            if os.path.exists(f'{playlist_id}.{extension}'):
                os.remove(f'{playlist_id}.{extension}')
            return []
