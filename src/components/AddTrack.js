import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import TrackSelector from "./TrackSelector";

var searches = 0;

export default function AddTrack({ numTracks = 0, spotify = null, onAdd = f => f }) {
  const [currentId, setCurrentId] = useState(null);
  const [spinner, setSpinner] = useState(0);

  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center">
          <TrackSelector
            spotify={spotify}
            onSelect={(id) => setCurrentId(id)}
            onSearch={() => { searches++; if (searches !== 0) setSpinner(true); }}
            onSearchEnd={() => { searches--; if (searches === 0) setSpinner(false); }}
          ></TrackSelector>
          <div style={{ width: '10px' }} />
          {spinner ?
            <Spinner
              animation="grow" size="md"
              onClick={() => {
                if (currentId && numTracks < 5) {
                  onAdd(currentId);
                };
              }}
            /> :
            <FaPlus
              size="25"
              className={(currentId && numTracks < 5) ? "link" : "text-muted"}
              onClick={() => {
                if (currentId && numTracks < 5) {
                  onAdd(currentId);
                };
              }}
            />
          }
        </div>
      </Card.Body>
    </Card>
  );
}
