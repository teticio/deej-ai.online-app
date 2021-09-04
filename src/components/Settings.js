import { useState, useEffect } from "react";
import { FaBackward } from "react-icons/fa";
import { HorizontalSpacer } from "../lib";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export default function Settings({ size, creativity, noise, onChange = f => f, onClose = f => f }) {
  const [_size, setSize] = useState(size);
  const [_creativity, setCreativity] = useState(creativity);
  const [_noise, setNoise] = useState(noise);
  const setValidSize = (size) => setSize(Math.max(Math.min(size, 100), 1))
  const update = () => onChange(_size, _creativity, _noise);

  useEffect(() => () => update());

  return (
    <>
      <Card>
        <Card.Body>
          <Form.Label htmlFor="size">Size</Form.Label>
          <h6 className="text-muted">Controls the number of tracks in the playlist, or the number to be generated between waypoints.</h6>
          <Form.Control
            id="size"
            className="text-light"
            type="number"
            min="1"
            max="100"
            value={_size}
            onChange={event => {
              if (event.target.value !== "") {
                setValidSize(event.target.value);
                update();
              } else {
                setSize("");
              }
            }}
            onBlur={event => {
              setValidSize(event.target.value);
              update();
            }}
          />
          <hr />
          <Form.Label htmlFor="creativity">Creativity</Form.Label>
          <h6 className="text-muted">A value of 0% will select tracks based on how likely they are to appear together in a Spotify user's
            playlist. A value of 100% will select tracks based purely on how they sound.</h6>
          <div className="d-flex flex-row align-items-center" >
            <h6><small>{Math.round(_creativity * 100)}%</small></h6>
            <HorizontalSpacer />
            <Form.Range
              id="creativity"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={_creativity}
              onChange={event => {
                setCreativity(event.target.value);
                update();
              }}
            />
          </div>
          <hr />
          <Form.Label htmlFor="noise">Noise</Form.Label>
          <h6 className="text-muted">Controls the amount of randomness to apply.</h6>
          <div className="d-flex flex-row align-items-center" >
            <h6><small>{Math.round(_noise * 100)}%</small></h6>
            <HorizontalSpacer />
            <Form.Range
              id="noise"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={_noise}
              onChange={event => {
                setNoise(event.target.value);
                update();
              }}
            />
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <FaBackward
              data-testid="close"
              size="25"
              className="link"
              onClick={() => {
                update();
                onClose();
              }}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
