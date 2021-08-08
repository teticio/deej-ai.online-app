export default async function GeneratePlaylist(tracks) {
  try {
    let response = await fetch('http://localhost:5050/spotify_server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'replace': true,
        'size': 10,
        'noise': 0,
        'creativity': 0.5,
        'tracks': tracks.tracks.map((track) => track.id)
      })
    });
    let text = await response.text();
    let ids = text.split(' ');
    ids.pop();
    let playlist = { 'tracks': ids.map((id) => { return { 'id': id } }) };
    return playlist;
  } catch (error) {
    console.error('Error:', error);
  };
}