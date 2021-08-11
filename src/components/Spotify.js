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
      this.refreshToken = params.refresh_token;    }
  }

  loggedIn() {
    return this.getAccessToken() !== null;
  }

  async getCurrentUser() {
    const reponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getAccessToken()
      }
    });
    const json = reponse.json();
    return json;
  }

  async createNewPlayist(name, tracks) {
    const user = await this.getCurrentUser();
    console.log(user);
    const playlists = await this.getUserPlaylists(user.id, { limit: 20, offset: 0 });
    console.log(playlists);
  }
}