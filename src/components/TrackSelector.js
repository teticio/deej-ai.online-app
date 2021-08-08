import { useState } from "react";
import Col from 'react-bootstrap/Col';
import { useDebouncedEffect } from "./useDebouncedEffect";
import "./TrackSelector.css";

export default function TrackSelector({ onSelect = f => f }) {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useDebouncedEffect(() => {
    async function fetchSearchResults() {
      if (searchString !== "") {
        try {
          let response = await fetch('http://localhost:5050/spotify_server', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'search_string': searchString
            })
          });
          let json = await response.json();
          setSearchResults(json);
          onSelect((json.length > 0) ? json[0].id : null);
        } catch (error) {
          console.error('Error:', error);
        };
      }
    }

    fetchSearchResults();
  }, [searchString], 1000);

  return (
    <Col>
      <input
        placeholder="Search..."
        onChange={event => setSearchString(event.target.value)}
      />
      <div style={{ marginTop: '10px' }} />
      <select onChange={event => onSelect(event.target.value)}>\
        size="1"
        {searchResults.map(({ id, track }, index) => (
          <option key={index} value={id}>
            {track}
          </option>
        ))}
      </select>
    </Col>
  );
}
