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
  spotify, navigate
) => {
  return {
    '/': {
      element: CreatePlaylist,
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
      element: LatestPlaylists,
      spotify: spotify
    },
    '/top': {
      element: TopPlaylists,
      spotify: spotify
    },
    '/most_uploaded': {
      element: MostUploadedPlaylists,
      spotify: spotify
    },
    '/search': {
      element: SearchPlaylists,
      spotify: spotify
    },
    '/about': {
      element: About
    },
    '/privacy_policy': {
      element: PrivacyPolicy
    },
    '/privacy_policy.html': {
      element: PrivacyPolicy
    },
    '*': {
      element: NotFound
    }
  };
}
