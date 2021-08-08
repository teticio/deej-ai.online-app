import { FaTimes } from "react-icons/fa";
import Track from "./Track";

export default function RemovableTrack({ id, uuid, onRemove = f => f }) {
  return (
    <>
      <Track id={id}>
      </Track>
      <div style={{ width: '10px' }} />
      <FaTimes onClick={() => onRemove(uuid)} />
    </>
  );
}
