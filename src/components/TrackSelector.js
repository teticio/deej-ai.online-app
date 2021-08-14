import { useState, useEffect } from "react";
import Col from 'react-bootstrap/Col';
import { debounceFunction } from "../lib";
import "./TrackSelector.css";

export default function TrackSelector({ onSelect = f => f, onSearch = f => f, onSearchEnd = f => f }) {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => debounceFunction(() => {
    async function fetchSearchResults() {
      onSearch();
      if (searchString !== "") {
        try {
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
        } catch (error) {
          console.error('Error:', error);
        };
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
    });
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
