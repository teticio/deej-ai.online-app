import About from './About';
import Settings from './Settings';
import NotFound from './NotFound';
import TopPlaylists from './TopPlaylists';
import ShowPlaylist from './ShowPlaylist';
import PrivacyPolicy from './PrivacyPolicy';
import CreatePlaylist from './CreatePlaylist';
import LatestPlaylists from './LatestPlaylists';
import SearchPlaylists from './SearchPlaylists';
import MostUploadedPlaylists from './MostUploadedPlaylists';

export const getRoutes = (
  waypoints, setWaypoints,
  size, setSize,
  creativity, setCreativity,
  noise, setNoise,
  playlist, setPlaylist,
  spotify, navigate, numPlaylists
) => {
  return {
    '/': {
      element: CreatePlaylist,
      title: "Choose the waypoints for your musical journey",
      waypoints: waypoints,
      size: size,
      creativity: creativity,
      noise: noise,
      spotify: spotify,
      onCreate: (playlist, waypoints) => {
        setWaypoints(() => waypoints);
        setPlaylist(() => playlist);
        navigate('/playlist');
      },
      onSettings: waypoints => {
        setWaypoints(() => waypoints);
        navigate('/settings');
      }
    },
    '/playlist': {
      element: ShowPlaylist,
      playlist: playlist,
      onClose: () => navigate('/'),
      spotify: spotify,
      userPlaylist: true,
      style: { padding: 15 }
    },
    '/settings': {
      element: Settings,
      title: "Settings",
      size: size,
      creativity: creativity,
      noise: noise,
      onChange: (size, creativity, noise) => {
        setSize(() => { return size !== '' ? size : 0; });
        setCreativity(() => creativity);
        setNoise(() => noise);
      },
      onClose: () => navigate('/')
    },
    '/latest': {
      element: LatestPlaylists,
      title: "Latest playlists",
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/top': {
      element: TopPlaylists,
      title: "Top playlists",
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/most_uploaded': {
      element: MostUploadedPlaylists,
      title: "Most uploaded playlists",
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/search': {
      element: SearchPlaylists,
      title: "Search playlists",
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/about': {
      element: About,
      title: "About Deej-A.I."
    },
    '/privacy_policy': {
      element: PrivacyPolicy
    },
    '/privacy_policy.html': {
      element: PrivacyPolicy
    },
    '*': {
      element: NotFound,
      title: "I still haven't found what you're looking for..."
    }
  };
}
