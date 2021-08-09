export default async function SavePlaylist(playlist) {
  let now = new Date();

  try {
    let response = await fetch('http://localhost:8000/save_playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'created': now.toISOString(),
        'tracks': JSON.stringify(playlist.tracks.map((track) => track.id))
      })
    });
    let db_item = await response.json();
    return db_item.id;
  } catch (error) {
    console.error('Error:', error);
  };
}