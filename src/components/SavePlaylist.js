export default async function SavePlaylist(playlist) {
  const now = new Date();

  try {
    const response = await fetch('/create_playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'created': now.toISOString(),
        'tracks': JSON.stringify(playlist.tracks.map((track) => track.id))
      })
    });
    const db_item = await response.json();
    return db_item.id;
  } catch (error) {
    console.error('Error:', error);
  };
}

export async function UpdatePlaylistName(id, name) {
  try {
    fetch('/update_playlist_name', {
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

export async function UpdatePlaylistRating(id, av_rating, num_ratings) {
  try {
    fetch('/update_playlist_rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id,
        'av_rating': av_rating,
        'num_ratings': num_ratings
      })
    });
  } catch (error) {
    console.error('Error:', error);
  };
}