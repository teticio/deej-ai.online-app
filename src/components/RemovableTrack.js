import { FaTimes } from "react-icons/fa";
import Track from "./Track";

export default function RemovableTrack({ track, uuid, onRemove = f => f }) {
  return (
    <>
      <Track track={track}>
      </Track>
      <div style={{ width: '10px' }} />
      <FaTimes onClick={() => onRemove(uuid)} />
    </>
  );
}
