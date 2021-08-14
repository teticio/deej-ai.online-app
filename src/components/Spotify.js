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

  // http://localhost:3000/#access_token=BQDfl_xhCOuq-Kslzs7giLVds3uLlX5Sub5IhrFQWtnM2mC3KdNUvP2r4ozgkvlFrrDg10PHKAd82z-Xhqvt9dA6T1ow1iP7yoDymxoKX7-nFzamSP9u1Tv_OgRsvrr9bs-Dek-cr9tNaZgYxc9_DQUh_EigVI32BMNQUBpm2u5koQzR&refresh_token=AQDn0qVlL6MitTT_Bwh1555ntTTf8fQvmm5JAFU5OC9hyXGH0gs-iffRRMH0ZOrzbu1WlUWeyg9pNl7uq3bjLbT7jJCGFTPjQvIfAFUocQh9c8wP0xNKI_FoUX3ZfVSPrUE
  // json.error.message === "The access token expired"

  async autoRefresh(f, ...params) {
    let response = await f(); 
    if ('error' in response && response.error.message === "The access token expired") {
      response = await fetch(process.env.REACT_APP_API_URL + '/refresh_token?refresh_token=' + this.refreshToken);
      const json = await response.json();
      this.setAccessToken(json.access_token);
      response = f();
    }
    return response;
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
        description: 'Created by Deej-A.I. http://deej-ai.online'
      });
    }
    await this.replaceTracksInPlaylist(
      playlist.id,
      track_ids.map((track_id) => `spotify:track:${track_id}`)
    );
    return playlist;
  }
}