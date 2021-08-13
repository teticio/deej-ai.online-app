export default async function GeneratePlaylist(playlist) {
  try {
    const waypoints = playlist.tracks
    const response = await fetch('/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'tracks': waypoints,
        'size': 10,
        'creativity': 0.5,
        'noise': 0
      })
    });
    const tracks = await response.json();
    const new_playlist = {
      'name': 'Deej-A.I.',
      'tracks': tracks,
      'waypoints': waypoints,
      'av_rating': 0,
      'num_ratings': 0
    };
    return new_playlist;
  } catch (error) {
    console.error('Error:', error);
  };
}