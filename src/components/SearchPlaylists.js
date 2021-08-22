import { useState, useEffect, useReducer } from "react";
import { FaSearch } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import ShowPlaylists from "./ShowPlaylists";
import { HorizontalSpacer, VerticalSpacer } from "../lib";

export async function searchPlaylists(searchString, maxItems) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/search_playlists` +
    '?string=' + encodeURIComponent(searchString) +
    '&max_items=' + encodeURIComponent(maxItems));
  const playlists = await response.json();
  playlists.forEach((playlist, i) => {
    playlists[i].track_ids = JSON.parse(playlist.track_ids)
    playlists[i].tracks = JSON.parse(playlist.tracks)
    playlists[i].waypoints = JSON.parse(playlist.waypoints)
  });
  return playlists;
}

export default function SearchPlaylists({ spotify }) {
  const [topN, loadMore] = useReducer(n => n + 4, 4);
  const [playlists, setPlaylists] = useState([]);
  const [editing, setEditing] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [actualSearchString, setActualSearchString] = useState("");

  useEffect(() => {
    if (actualSearchString === "") {
      setPlaylists([]);
    } else {
      searchPlaylists(actualSearchString, topN)
        .then((playlists) => {
          setPlaylists(playlists);
        }).catch(error => console.error('Error:', error));
    }
  }, [actualSearchString, topN]);

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Search playlists</h3>
      <Card>
        <Card.Body>
          <div
            className="d-flex flex-row align-items-center"
            onClick={() => setEditing(true)}
          >
            <FaSearch />
            <HorizontalSpacer px={10} />
            {editing ?
              <input
                placeholder="Search..."
                value={searchString}
                onChange={event => setSearchString(event.target.value)}
                onBlur={event => {
                  setActualSearchString(searchString);
                  setEditing(false);
                }}
                onKeyUp={event => {
                  if (event.key === 'Enter') {
                    setActualSearchString(searchString);
                    setEditing(false);
                  }
                }}
              /> :
              <span>{searchString}</span>
            }
          </div>
        </Card.Body>
      </Card>
      <VerticalSpacer px={10} />
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      />
      {actualSearchString !== "" ?
        <span onClick={loadMore}>
          <h6 className="link" style={{ textAlign: "center" }}>Load more...</h6>
        </span> : <></>
      }
    </>
  );
}
