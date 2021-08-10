import pickle
import numpy as np


class DeejAI:
    def __init__(self):
        self.mp3tovecs = pickle.load(open('spotifytovec.p', 'rb'))
        self.mp3tovecs = dict(
            zip(self.mp3tovecs.keys(), [
                self.mp3tovecs[_] / np.linalg.norm(self.mp3tovecs[_])
                for _ in self.mp3tovecs
            ]))
        self.tracktovecs = pickle.load(open('tracktovec.p', 'rb'))
        self.tracktovecs = dict(
            zip(self.tracktovecs.keys(), [
                self.tracktovecs[_] / np.linalg.norm(self.tracktovecs[_])
                for _ in self.tracktovecs
            ]))
        self.tracks = pickle.load(open('spotify_tracks.p', 'rb'))
        self.track_ids = [_ for _ in self.mp3tovecs]
        self.track_indices = dict(
            map(lambda x: (x[1], x[0]), enumerate(self.mp3tovecs)))
        self.mp3tovecs = np.array([[self.mp3tovecs[_], self.tracktovecs[_]]
                                   for _ in self.mp3tovecs])
        del self.tracktovecs

    async def most_similar(self,
                           mp3tovecs,
                           weights,
                           positive=[],
                           negative=[],
                           noise=0,
                           vecs=None):
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

    async def most_similar_by_vec(self,
                                  mp3tovecs,
                                  weights,
                                  positives=[],
                                  negatives=[],
                                  noise=0):
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

    async def join_the_dots(self, weights, ids, n=5, noise=0):
        playlist = []
        playlist_tracks = [self.tracks[_] for _ in ids]
        end = start = ids[0]
        start_vec = self.mp3tovecs[self.track_indices[start]]
        for end in ids[1:]:
            end_vec = self.mp3tovecs[self.track_indices[end]]
            playlist.append(start)
            for i in range(n):
                candidates = await self.most_similar_by_vec(
                    self.mp3tovecs,
                    weights, [[(n - i + 1) / n * start_vec[k] +
                               (i + 1) / n * end_vec[k]]
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

    async def make_playlist(self,
                            weights,
                            playlist,
                            size=10,
                            lookback=3,
                            noise=0):
        playlist_tracks = [self.tracks[_] for _ in playlist]
        playlist_indices = [self.track_indices[_] for _ in playlist]
        for i in range(len(playlist), size):
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
            playlist_indices.append(candidate)
        return playlist
