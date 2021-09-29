import React from 'react';
import Track from './Track';
import { FaTimes } from './Platform';
import { Row, Col, HorizontalSpacer } from './Lib';

export default function RemovableTrack({ track_id, uuid, onRemove = f => f }) {
  return (
    <Row>
      <Col style={{ flex: 1 }}>
        <Track
          track_id={track_id}
        >
        </Track>
      </Col>
      <Col>
        <HorizontalSpacer />
      </Col>
      <Col>
        <FaTimes
          size='25'
          className='link'
          onClick={() => onRemove(uuid)}
        />
      </Col>
    </Row>
  );
}
