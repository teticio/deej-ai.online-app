import { FaTimes } from "react-icons/fa";
import Track from "./Track";

export default function RemovableTrack({ track_id, uuid, onRemove = f => f }) {
  return (
    <>
      <Track track_id={track_id}>
      </Track>
      <div style={{ width: '10px' }} />
      <FaTimes
        size="25"
        className="link"
        onClick={() => onRemove(uuid)}
      />
    </>
  );
}
