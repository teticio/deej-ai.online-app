import About from './About';
import Settings from './Settings';
import NotFound from './NotFound';
import ShowPlaylist from './ShowPlaylist';
import PrivacyPolicy from './PrivacyPolicy';
import CreatePlaylist from './CreatePlaylist';
import SearchPlaylists from './SearchPlaylists';
import SelectedPlaylists from './SelectedPlaylists';

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
        setWaypoints(waypoints);
        setPlaylist(playlist);
        navigate('/playlist');
      },
      onSettings: waypoints => {
        setWaypoints(waypoints);
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
        setSize(size !== '' ? size : 0);
        setCreativity(creativity);
        setNoise(noise);
      },
      onClose: () => navigate('/')
    },
    '/latest': {
      element: SelectedPlaylists,
      title: "Latest playlists",
      query: 'latest_playlists',
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/top': {
      element: SelectedPlaylists,
      title: "Top playlists",
      query: 'top_playlists',
      spotify: spotify,
      numPlaylists: numPlaylists
    },
    '/most_uploaded': {
      element: SelectedPlaylists,
      title: "Most uploaded playlists",
      query: 'most_uploads',
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
