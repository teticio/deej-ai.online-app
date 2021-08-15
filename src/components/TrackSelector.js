import { useState, useEffect } from "react";
import Col from 'react-bootstrap/Col';
import { debounceFunction } from "../lib";
import "./TrackSelector.css";

export default function TrackSelector({ spotify = null, onSelect = f => f, onSearch = f => f, onSearchEnd = f => f }) {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (spotify && spotify.loggedIn()) {
        spotify.autoRefresh(() => spotify.getMyCurrentPlayingTrack())
          .then((response) => {
            console.log(response);
            setCurrentTrack(response.item ? response.item.name : null);
          }).catch(error => console.error('Error:', error));
      } else {
        setCurrentTrack(null);
      }
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => debounceFunction(() => {
    async function fetchSearchResults() {
      onSearch();
      if (searchString !== "") {
        let response = await fetch(process.env.REACT_APP_API_URL + '/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'string': searchString
          })
        });
        let json = await response.json();
        setSearchResults(json);
        onSelect((json.length > 0) ? json[0].id : null);
        return json;
      } else {
        setSearchResults([]);
        onSelect(null);
      }
      return [];
    }
    fetchSearchResults().then((results) => {
      if (results.length > 0) {
        onSelect(results[0].track_id);
      }
      onSearchEnd();
    }).catch(error => console.error('Error:', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 1000), [searchString]);

  return (
    <Col>
      <input
        placeholder="Search..."
        onChange={event => {
          setSearchString(event.target.value);
        }}
      />
      <div style={{ marginTop: '10px' }} />
      {currentTrack ?
        <>
          <div style={{ marginTop: '10px' }} />
          <span>{currentTrack}</span>
        </> : <></>
      }
      <select onChange={event => onSelect(event.target.value)}>\
        size="1"
        {searchResults.map(({ track_id, track }, i) => (
          <option key={i} value={track_id}>
            {track}
          </option>
        ))}
      </select>
    </Col>
  );
}
