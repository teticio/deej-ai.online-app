import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ShowPlaylists, { SearchPlaylists } from "./ShowPlaylists";

export default function SearchScreen({ spotify }) {
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
                  SearchPlaylists(searchString, 8)
                    .then((playlists) => {
                      setPlaylists(playlists);
                    }).catch(error => console.error('Error:', error));
                }}
                onKeyUp={event => {
                  if (event.keyCode === 13) {
                    setEditing(false);
                    SearchPlaylists(searchString, 8)
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
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
    </Container>
  );
}
