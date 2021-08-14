export default async function GeneratePlaylist(playlist, size = 10, creativity = 0.5, noise = 0) {
  try {
    const waypoints = playlist.track_ids
    const response = await fetch(process.env.REACT_APP_API_URL + '/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'track_ids': waypoints,
        'size': size,
        'creativity': creativity,
        'noise': noise
      })
    });
    const json = await response.json();
    const new_playlist = {
      'name': 'Deej-A.I.',
      'track_ids': json.track_ids,
      'tracks': json.tracks,
      'waypoints': waypoints,
      'av_rating': 0,
      'num_ratings': 0
    };
    return new_playlist;
  } catch (error) {
    console.error('Error:', error);
  };
}