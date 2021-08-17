export default async function savePlaylist(playlist) {
  const now = new Date();

  const response = await fetch(process.env.REACT_APP_API_URL + '/create_playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'created': now.toISOString(),
      'track_ids': JSON.stringify(playlist.track_ids),
      'tracks': JSON.stringify(playlist.tracks),
      'waypoints': JSON.stringify(playlist.waypoints)
    })
  });
  const db_item = await response.json();
  return db_item.id;
}

export async function updatePlaylistName(id, name) {
  fetch(process.env.REACT_APP_API_URL + '/update_playlist_name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'id': id,
      'name': name
    })
  });
}

export async function updatePlaylistRating(id, av_rating, num_ratings) {
  fetch(process.env.REACT_APP_API_URL + '/update_playlist_rating', {
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
}

export async function updatePlaylistId(id, user_id, playlist_id) {
  fetch(process.env.REACT_APP_API_URL + '/update_playlist_id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'id': id,
      'user_id': user_id,
      'playlist_id': playlist_id
    })
  });
}
