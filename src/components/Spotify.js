import SpotifyWebApi from "spotify-web-api-js";

export default class Spotify extends SpotifyWebApi {
  constructor() {
    super();

    const getHashParams = () => {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      while ((e = r.exec(q)) !== null) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    };
    const params = getHashParams();

    this.refreshToken = null;
    if (params.access_token) {
      this.setAccessToken(params.access_token);
      this.refreshToken = params.refresh_token;
    }
  }

  loggedIn() {
    return this.getAccessToken() !== null;
  }

  async getCurrentUser() {
    try {
      const reponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.getAccessToken()
        }
      });
      const json = reponse.json();
      return json;
    } catch (error) {
      console.error('Error:', error);
    };
  }

  async createNewPlayist(name, track_ids) {
    const user = await this.getCurrentUser();
    let offset = 0;
    let playlists = [];

    while (true) {
      const response = await this.getUserPlaylists(user.id, { offset: offset });
      playlists.push(...response.items);
      if (playlists.length === response.total) {
        break;
      }
      offset = playlists.length;
    }
    const index = playlists.map(playlist => playlist.name).indexOf(name);
    let playlist = null;
    if (index >= 0) {
      playlist = playlists[index];
    } else {
      playlist = await this.createPlaylist(user.id, {
        name: name,
        description: 'Created by Deej-A.I. http://deej-ai.online'
      });
    }
    await this.replaceTracksInPlaylist(playlist.id, track_ids.map((track_id) => `spotify:track:${track_id}`));
    return playlist;
  }
}