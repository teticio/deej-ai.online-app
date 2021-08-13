import { useState, useEffect } from "react";
import Col from 'react-bootstrap/Col';
import { useDebouncedEffect, debounceFunction } from "../lib";
import "./TrackSelector.css";

export default function TrackSelector({ onSelect = f => f, onSearch = f => f, onSearchEnd = f => f }) {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => debounceFunction(() => {
    async function fetchSearchResults() {
      console.log("search: " + searchString);
      onSearch();
      if (searchString !== "") {
        try {
          let response = await fetch('/search', {
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
        } catch (error) {
          console.error('Error:', error);
        };
      } else {
        setSearchResults([]);
        onSelect(null);
      }
    }
    fetchSearchResults().then(() => onSearchEnd());
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
        {searchResults.map(({ id, track }, i) => (
          <option key={i} value={id}>
            {track}
          </option>
        ))}
      </select>
    </Col>
  );
}
