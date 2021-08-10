export default async function SavePlaylist(playlist) {
  let now = new Date();

  try {
    let response = await fetch('http://localhost:8000/create_playlist', {
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

export async function UpdatePlaylistName(id, name) {
  try {
    fetch('http://localhost:8000/update_playlist_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id,
        'name': name
      })
    });
  } catch (error) {
    console.error('Error:', error);
  };
}