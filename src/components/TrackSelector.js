import { useState, useEffect } from "react";
import { FaSpotify } from "react-icons/fa"
import Container from 'react-bootstrap/Container';
import { debounceFunction } from "../lib";
import Search, { SearchSimilar } from "./Search";
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
            setCurrentTrack(response.item ? {
              'track':
                `${response.item.artists[0].name} - ${response.item.name}`,
              'url': response.item.preview_url
            } : null);
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
        const tracks = await Search(searchString);
        setSearchResults(tracks);
        onSelect((tracks.length > 0) ? tracks[0].id : null);
        return tracks;
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
    }).catch(error => {
      onSearchEnd();
      console.error('Error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 1000), [searchString]);

  return (
    <Container>
      {currentTrack ?
        <>
          <div style={{ marginTop: '10px' }} />
          <div className="d-flex align-items-center" onClick={() => {
            onSearch();
            SearchSimilar(currentTrack.url)
              .then(tracks => {
                onSearchEnd();
                setSearchResults(tracks);
              })
              .catch(error => {
                onSearchEnd();
                console.error('Error:', error);
              });
          }}>
            <FaSpotify size="15" className="text-success" />
            <div style={{ width: '10px' }} />
            <h6 className="text-success">{currentTrack.track}</h6>
          </div>
        </> : <></>
      }
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
    </Container >
  );
}
