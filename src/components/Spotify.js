import SpotifyWebApi from 'spotify-web-api-js';

export default class Spotify extends SpotifyWebApi {
  constructor(params) {
    super();
    this.refreshToken = null;
    if (params.access_token) {
      this.setAccessToken(params.access_token);
      this.refreshToken = params.refresh_token;
      localStorage.setItem('accessToken', params.access_token);
      localStorage.setItem('refreshToken', params.refresh_token);
    } else {
      this.setAccessToken(localStorage.getItem('accessToken'));
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  loggedIn() {
    return this.getAccessToken() !== null && this.getAccessToken() !== undefined;
  }

  logOut() {
    this.setAccessToken(null);
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async autoRefresh(f, ...params) {
    try {
      return await f();
    } catch (error) {
      let response = JSON.parse(error.response);
      if (response.error && response.error.message === "The access token expired") {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/refresh_token?refresh_token=${this.refreshToken}`);
        const json = await response.json();
        this.setAccessToken(json.access_token);
        return f();
      }
    }
  }

  async getCurrentUser() {
    const reponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`
      }
    });
    const json = reponse.json();
    return json;
  }

  async createNewPlayist(name, track_ids) {
    const user = await this.autoRefresh(() => this.getCurrentUser());
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
        description: 'Created by Deej-A.I. https://deej-ai.online'
      });
    }
    await this.replaceTracksInPlaylist(
      playlist.id,
      track_ids.map(track_id => `spotify:track:${track_id}`)
    );
    return playlist;
  }
}
