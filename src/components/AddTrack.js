import { useState } from "react";
import TrackSelector from "./TrackSelector";
import { FaPlus } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';

var searches = 0;

export default function AddTrack({ onAdd = f => f }) {
  const [currentId, setCurrentId] = useState(null);
  const [spinner, setSpinner] = useState(0);

  return (
    <div className="d-flex flex-row align-items-center">
      <TrackSelector
        onSelect={(id) => setCurrentId(id)}
        onSearch={() => { searches++; if (searches !== 0) setSpinner(true); }}
        onSearchEnd={() => { searches--; if (searches === 0) setSpinner(false); }}
      ></TrackSelector>
      <div style={{ width: '10px' }} />
      {spinner ?
        <Spinner
          animation="grow" size="md"
          onClick={() => { if (currentId) { onAdd(currentId); }; }}
        /> :
        <FaPlus
          size="25"
          className={currentId ? "text-success" : "text-muted"}
          onClick={() => { if (currentId) { onAdd(currentId); }; }}
        />
      }
    </div>
  );
}
