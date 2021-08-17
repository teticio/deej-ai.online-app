export default async function search(searchString, maxItems=100) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'string': searchString,
      'max_items': maxItems
    })
  });
  const tracks = await response.json();
  return tracks;
}

export async function searchSimilar(url, maxItems=10) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/search_similar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'url': url,
      'max_items': maxItems
    })
  });
  const tracks = await response.json();
  return tracks;
}
