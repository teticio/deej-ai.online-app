import { FaBackward } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Playlist from './Playlist';

export default function ShowPlaylist({ playlist, onClose = f => f }) {
  return (
    <Card>
      <Card.Body>
        <Playlist {...playlist} />
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <FaBackward onClick={() => onClose()} />
        </div>
      </Card.Body>
    </Card>
  );
}

