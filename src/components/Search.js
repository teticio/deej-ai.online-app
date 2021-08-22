export default async function search(searchString, maxItems = 100) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/search` +
    '?string=' + encodeURIComponent(searchString) +
    '&max_items=' + encodeURIComponent(maxItems));
  const tracks = await response.json();
  return tracks;
}

export async function searchSimilar(url, maxItems = 10) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/search_similar` +
    '?url=' + encodeURIComponent(url) +
    '&max_items=' + encodeURIComponent(maxItems));
  const tracks = await response.json();
  return tracks;
}
