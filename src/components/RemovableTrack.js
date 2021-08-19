
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Track from "./Track";

export default function RemovableTrack({ track_id, uuid, onRemove = f => f }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Track
        track_id={track_id}
        onLoad={() => setLoaded(true)}
      >
      </Track>
      <div style={{ width: '10px' }} />
      {loaded ?
        <FaTimes
          size="25"
          className="link"
          onClick={() => onRemove(uuid)}
        /> : <></>
      }
    </>
  );
}
