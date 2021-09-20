
import { FaTimes } from 'react-icons/fa';
import { HorizontalSpacer } from './Lib';
import Track from './Track';

export default function RemovableTrack({ track_id, uuid, onRemove = f => f }) {
  return (
    <>
      <Track
        track_id={track_id}
      >
      </Track>
      <HorizontalSpacer />
      <FaTimes
        size='25'
        className='link'
        onClick={() => onRemove(uuid)}
      />
    </>
  );
}
