import TrackSelector from "./TrackSelector";
import { FaPlus } from "react-icons/fa";

export default function AddTrack({ onAdd = f => f }) {
  let currentId = null;

  return (
    <div className="d-flex flex-row align-items-center">
      <TrackSelector onSelect={(id) => { currentId = id }}>
      </TrackSelector>
      <div style={{width: '10px'}} />
      <FaPlus onClick={() => { if (currentId) { onAdd(currentId); }; }}/>
    </div>
  );
}
