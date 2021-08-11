export function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
<<<<<<< Updated upstream
  while ((e = r.exec(q)) === true) {
=======
  while ((e = r.exec(q)) !== null) {
>>>>>>> Stashed changes
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
