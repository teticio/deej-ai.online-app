export default async function GeneratePlaylist(playlist) {
  try {
    let response = await fetch('http://localhost:8000/playlist', {
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
    let ids = await response.json();
    let new_playlist = { 'tracks': ids.map((id) => { return { 'id': id } }) };
    return new_playlist;
  } catch (error) {
    console.error('Error:', error);
  };
}