import { useState } from "react";
import { FaBackward } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Footer from './Footer';

export default function Settings({ size, creativity, noise, onChange = f => f, onClose = f => f }) {
  const [_size, setSize] = useState(size);
  const [_creativity, setCreativity] = useState(creativity);
  const [_noise, setNoise] = useState(noise);
  const update = () => onChange(_size, _creativity, _noise);

  return (
    <>
      <Card>
        <Card.Body>
          <Form.Label>Size</Form.Label>
          <h6 className="text-muted">Controls the number of tracks in the playlist, or the number to be generated between waypoints.</h6>
          <Form.Control
            className="text-light"
            type="number"
            min="1"
            max="100"
            value={_size}
            onChange={(event) => {
              setSize(Math.max(Math.min(event.target.value, 100), 1));
              update();
            }}
          />
          <hr />
          <Form.Label>Creativity</Form.Label>
          <h6 className="text-muted">A value of 0 will select tracks based on how likely they are to appear in a user's
            playlist. A value of 1 will select tracks based purely on how they sound.</h6>
          <Form.Range
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={_creativity}
            onChange={(event) => { setCreativity(event.target.value); update(); }}
          />
          <hr />
          <Form.Label>Noise</Form.Label>
          <h6 className="text-muted">Controls the amount of randomness to apply.</h6>
          <Form.Range
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={_noise}
            onChange={(event) => { setNoise(event.target.value); update(); }}
          />
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <FaBackward
              size="25"
              className="text-success"
              onClick={() => { update(); onClose(); }}
            />
          </div>
        </Card.Body>
      </Card>
      <Footer />
    </>
  );
}