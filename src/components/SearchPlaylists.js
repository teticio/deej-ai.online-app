import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ShowPlaylists from "./ShowPlaylists";

export async function searchPlaylists(string, max_items) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/search_playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'string': string,
      'max_items': max_items
    })
  });
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function SearchPlaylists({ spotify }) {
  const [playlists, setPlaylists] = useState([]);
  const [editing, setEditing] = useState(true);
  const [searchString, setSearchString] = useState("");

  return (
    <Container>
      <h3 style={{ textAlign: "center" }}>Search playlists</h3>
      <Card>
        <Card.Body>
          <div className="d-flex flex-row align-items-center" onClick={() => { setEditing(true); }}>
            <FaSearch />
            <div style={{ width: '10px' }} />
            {editing ?
              <input
                placeholder="Search..."
                value={searchString}
                onChange={event => setSearchString(event.target.value)}
                onBlur={() => {
                  setEditing(false);
                  searchPlaylists(searchString, 8)
                    .then((playlists) => {
                      setPlaylists(playlists);
                    }).catch(error => console.error('Error:', error));
                }}
                onKeyUp={event => {
                  if (event.key === 'Enter') {
                    setEditing(false);
                    searchPlaylists(searchString, 8)
                      .then((playlists) => {
                        setPlaylists(playlists);
                      }).catch(error => console.error('Error:', error));
                  }
                }}
              /> :
              <span>{searchString}</span>
            }
          </div>
        </Card.Body>
      </Card>
      <div style={{ marginTop: '10px' }} />
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
    </Container>
  );
}
