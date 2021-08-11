export default async function GeneratePlaylist(playlist) {
  try {
    const response = await fetch('/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'tracks': playlist.tracks.map((track) => track.id),
        'size': 10,
        'creativity': 0.5,
        'noise': 0
      })
    });
    const ids = await response.json();
    const new_playlist = {
      'name': 'Deej-A.I.',
      'tracks': ids.map((id) => { return { 'id': id } })
    };
    return new_playlist;
  } catch (error) {
    console.error('Error:', error);
  };
}