import { useState } from "react";
import { FaBackward } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Playlist from './Playlist';
import { UpdatePlaylistName } from "./SavePlaylist";

export default function ShowPlaylist({ playlist, onClose = f => f }) {
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  return (
    <Card>
      <Card.Body>
        <Card.Title onClick={() => setEditing(true)}>
          {editing ?
            <input
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              onKeyUp={(event) => {
                if (event.keyCode===13) {
                  setEditing(false);
                  UpdatePlaylistName(playlist.id, playlistName);
                }
              }}
            /> :
            <p>{playlistName}</p>}
        </Card.Title>
        <hr />
        <Playlist {...playlist} />
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <FaBackward onClick={() => onClose()} />
        </div>
      </Card.Body>
    </Card>
  );
}

