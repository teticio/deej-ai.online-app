import { useState } from "react";
import TrackSelector from "./TrackSelector";
import { FaPlus } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';

export default function AddTrack({ onAdd = f => f }) {
  const [currentId, setCurrentId] = useState(null);
  const [spinner, setSpinner] = useState(false);

  return (
    <div className="d-flex flex-row align-items-center">
      <TrackSelector
        onSelect={(id) => setCurrentId(id)}
        onSearch={() => setSpinner(true)}
        onSearchEnd={() => setSpinner(false)}
      ></TrackSelector>
      <div style={{ width: '10px' }} />
      {spinner ?
        <Spinner animation="grow" size="sm" /> :
        <FaPlus
          color={currentId ? 'white' : 'gray'}
          onClick={() => { if (currentId) { onAdd(currentId); }; }}
        />
      }
    </div>
  );
}
