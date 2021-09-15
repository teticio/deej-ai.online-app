"""Playlist generation using Deep Learning models.
"""
import os
import re
import uuid
import pickle
import random
import shutil
import logging
from io import BytesIO

import librosa
import requests
import numpy as np
from starlette.concurrency import run_in_threadpool

import tensorflow as tf
from keras.models import load_model


class DeejAI:
    """Playlist generation class.
    """
    N_FFT = 2048
    HOP_LENGTH = 512

    def __init__(self):
        with open('spotifytovec.p', 'rb') as file:
            mp3tovecs = pickle.load(file)
        mp3tovecs = dict(
            zip(mp3tovecs.keys(), [
                mp3tovecs[_] / np.linalg.norm(mp3tovecs[_]) for _ in mp3tovecs
            ]))
        with open('tracktovec.p', 'rb') as file:
            tracktovecs = pickle.load(file)
        tracktovecs = dict(
            zip(tracktovecs.keys(), [
                tracktovecs[_] / np.linalg.norm(tracktovecs[_])
                for _ in tracktovecs
            ]))
        with open('spotify_tracks.p', 'rb') as file:
            self.tracks = pickle.load(file)
        self.track_ids = list(mp3tovecs)
        self.track_indices = dict(
            map(lambda x: (x[1], x[0]), enumerate(mp3tovecs)))
        self.mp3tovecs = np.array([[mp3tovecs[_], tracktovecs[_]]
                                   for _ in mp3tovecs])
        del mp3tovecs, tracktovecs
        self.model = load_model('speccy_model',
                                custom_objects={
                                    'cosine_proximity':
                                    tf.compat.v1.keras.losses.cosine_proximity
                                })

    def get_tracks(self):
        """Get tracks.

        Returns:
            dict: Tracks.
        """
        return self.tracks

    async def search(self, string, max_items=100):
        """Find all tracks with artist or title containing all words in string.

        Args:
            string (str): Search string.
            max_items (int, optional): Maximum number of tracks to return. Defaults to 100.
        """
        def _search():
            tracks = self.tracks
            search_string = re.sub(r'([^\s\w]|_)+', '', string.lower()).split()
            ids = sorted([
                track for track in tracks if all(
                    word in re.sub(r'([^\s\w]|_)+', '', tracks[track].lower())
                    for word in search_string)
            ],
                         key=lambda x: tracks[x])[:max_items]
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

    async def most_similar(self,  # pylint: disable=too-many-arguments
                           mp3tovecs,
                           weights,
                           positive=iter(()),
                           negative=iter(()),
                           noise=0,
                           vecs=None):
        """Most similar IDs.
        """
        mp3_vecs_i = np.array([
            weights[j] *
            np.sum([mp3tovecs[i, j]
                    for i in positive] + [-mp3tovecs[i, j] for i in negative],
                   axis=0) for j in range(len(weights))
        ])
        if vecs is not None:
            mp3_vecs_i += np.sum(vecs, axis=0)
        if noise != 0:
            for mp3_vec_i in mp3_vecs_i:
                mp3_vec_i += np.random.normal(
                    0, noise * np.linalg.norm(mp3_vec_i), mp3tovecs.shape[2])
        result = list(
            np.argsort(
                np.tensordot(mp3tovecs, mp3_vecs_i, axes=((1, 2), (0, 1)))))
        for i in negative:
            del result[result.index(i)]
        result.reverse()
        for i in positive:
            del result[result.index(i)]
        return result

    async def most_similar_by_vec(self,  # pylint: disable=too-many-arguments
                                  mp3tovecs,
                                  weights,
                                  positives=iter(()),
                                  negatives=iter(()),
                                  noise=0):
        """Most similar IDs by vector.
        """
        mp3_vecs_i = np.array([
            weights[j] * np.sum(positives[j] if positives else [] +
                                -negatives[j] if negatives else [],
                                axis=0) for j in range(len(weights))
        ])
        if noise != 0:
            for mp3_vec_i in mp3_vecs_i:
                mp3_vec_i += np.random.normal(
                    0, noise * np.linalg.norm(mp3_vec_i), mp3tovecs.shape[2])
        result = list(
            np.argsort(
                -np.tensordot(mp3tovecs, mp3_vecs_i, axes=((1, 2), (0, 1)))))
        return result

    async def join_the_dots(self, weights, ids, size=5, noise=0):
        """Generate playlist that joins the dots between given waypoints.
        """
        playlist = []
        playlist_tracks = [self.tracks[_] for _ in ids]
        end = start = ids[0]
        start_vec = self.mp3tovecs[self.track_indices[start]]
        for end in ids[1:]:
            end_vec = self.mp3tovecs[self.track_indices[end]]
            playlist.append(start)
            for i in range(size):
                candidates = await self.most_similar_by_vec(
                    self.mp3tovecs,
                    weights, [[(size - i) / (size + 1) * start_vec[k] +
                               (i + 1) / (size + 1) * end_vec[k]]
                              for k in range(len(weights))],
                    noise=noise)
                for candidate in candidates:
                    track_id = self.track_ids[candidate]
                    if track_id not in playlist + ids and self.tracks[
                            track_id] not in playlist_tracks and self.tracks[
                                track_id][:self.tracks[track_id].
                                          find(' - ')] != self.tracks[playlist[
                                              -1]][:self.tracks[playlist[-1]].
                                                   find(' - ')]:
                        break
                playlist.append(track_id)
            start = end
            start_vec = end_vec
        playlist.append(end)
        return playlist

    async def make_playlist(self,  # pylint: disable=too-many-arguments
                            weights,
                            playlist,
                            size=10,
                            lookback=3,
                            noise=0):
        """Generate playlist starting from seed track(s).
        """
        playlist_tracks = [self.tracks[_] for _ in playlist]
        playlist_indices = [self.track_indices[_] for _ in playlist]
        for _ in range(len(playlist), size):
            candidates = await self.most_similar(
                self.mp3tovecs,
                weights,
                positive=playlist_indices[-lookback:],
                noise=noise)
            for candidate in candidates:
                track_id = self.track_ids[candidate]
                if track_id not in playlist and self.tracks[
                        track_id] not in playlist_tracks and self.tracks[
                            track_id][:self.tracks[track_id].
                                      find(' - ')] != self.tracks[playlist[
                                          -1]][:self.tracks[playlist[-1]].
                                               find(' - ')]:
                    break
            playlist.append(track_id)
            playlist_tracks.append(self.tracks[track_id])
            playlist_indices.append(candidate)  # pylint: disable=undefined-loop-variable
        return playlist

    async def get_similar_vec(self, track_url, max_items=10):
        """Most similar to MP3 given by URL.
        """
        def _get_similar_vec():
            y, sr = librosa.load(f'{playlist_id}.{extension}', mono=True)
            os.remove(f'{playlist_id}.{extension}')
            S = librosa.feature.melspectrogram(y=y,
                                               sr=sr,
                                               n_fft=self.N_FFT,
                                               hop_length=self.HOP_LENGTH,
                                               n_mels=n_mels,
                                               fmax=sr / 2)
            # Hack because Spotify samples are a shade under 30s
            x = np.ndarray(shape=(S.shape[1] // slice_size + 1, n_mels,
                                  slice_size, 1),
                           dtype=float)
            for slice_ in range(S.shape[1] // slice_size):
                log_S = librosa.power_to_db(
                    S[:, slice_ * slice_size:(slice_ + 1) * slice_size],
                    ref=np.max)
                if np.max(log_S) - np.min(log_S) != 0:
                    log_S = (log_S - np.min(log_S)) / (np.max(log_S) -
                                                       np.min(log_S))
                x[slice_, :, :, 0] = log_S
            # Hack because Spotify samples are a shade under 30s
            log_S = librosa.power_to_db(S[:, -slice_size:], ref=np.max)
            if np.max(log_S) - np.min(log_S) != 0:
                log_S = (log_S - np.min(log_S)) / (np.max(log_S) -
                                                   np.min(log_S))
            x[-1, :, :, 0] = log_S
            return self.model.predict(x)

        playlist_id = str(uuid.uuid4())
        n_mels = self.model.layers[0].input_shape[0][1]
        slice_size = self.model.layers[0].input_shape[0][2]

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
                self.mp3tovecs[:, np.newaxis, 0, :], [1], [vecs])
            ids = [
                self.track_ids[candidate]
                for candidate in candidates[0:max_items]
            ]
            return ids
        except Exception as error:  # pylint: disable=broad-except
            logging.error(error)
            if os.path.exists(f'./{playlist_id}.mp3'):
                os.remove(f'./{playlist_id}.mp3')
            return []
