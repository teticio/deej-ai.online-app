import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ShowPlaylists, { SearchPlaylists } from "./ShowPlaylists";

export default function SearchScreen({ spotify }) {
  const [playlists, setPlaylists] = useState([]);
  const [editing, setEditing] = useState(true);
  const [searchString, setSearchString] = useState("");

  return (
    <>
      <div style={{ marginTop: '10px' }} />
      <h3 style={{ textAlign: "center" }}>Search playlists</h3>
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
                })
            }}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                setEditing(false);
                SearchPlaylists(searchString, 8)
                  .then((playlists) => {
                    setPlaylists(playlists);
                  })
              }
            }}
          /> :
          <span>{searchString}</span>
        }
      </div>
      <ShowPlaylists
        playlists={playlists}
        spotify={spotify}
      /></>
  );
}