import { useState } from "react";
import TrackSelector from "./TrackSelector";
import { FaPlus } from "react-icons/fa";

export default function AddTrack({ onAdd = f => f }) {
  const [currentId, setCurrentId] = useState(null);

  return (
    <div className="d-flex flex-row align-items-center">
      <TrackSelector onSelect={(id) => { setCurrentId(id); }}>
      </TrackSelector>
      <div style={{ width: '10px' }} />
      <FaPlus
        color={currentId ? 'white' : 'gray'}
        onClick={() => { if (currentId) { onAdd(currentId); }; }}
      />
    </div>
  );
}
