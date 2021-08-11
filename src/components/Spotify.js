export function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q)) === true) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
