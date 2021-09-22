import React, { useState, useEffect } from 'react';
import { ScrollView, Card, Text, Small, FormLabel, FormControl, FormRange, FaBackward, Hr } from './Platform';
import { Row, Col, HorizontalSpacer, VerticalSpacer } from './Lib';

export default function Settings({ size, creativity, noise, onChange = f => f, onClose = f => f }) {
  const [_size, setSize] = useState(size);
  const [_creativity, setCreativity] = useState(creativity);
  const [_noise, setNoise] = useState(noise);
  const setValidSize = size => setSize(Math.max(Math.min(size, 100), 1))
  const update = () => onChange(_size, _creativity, _noise);

  const validateSize = (value) => {
    if (value && value !== '') {
      setValidSize(value);
      update();
    } else {
      setSize('');
    }
  }

  useEffect(() => () => update());

  return (
    <ScrollView>
      <Card style={{ padding: 15 }} surface={true}>
        <FormLabel htmlFor='size'>Size</FormLabel>
        <Text h6 className='text-muted'>Controls the number of tracks in the playlist, or the number to be generated between waypoints.</Text>
        <VerticalSpacer />
        <FormControl
          id='size'
          className='text-light'
          type='number'
          min='1'
          max='100'
          value={_size}
          onChange={event => validateSize(event.target.value)}
          onChangeText={value => validateSize(value)}
          onBlur={event => {
            if (event.target.value) {
              setValidSize(event.target.value);
              update();
            }
          }}
        />
        <Hr />
        <FormLabel htmlFor='creativity'>Creativity</FormLabel>
        <Text h6 className='text-muted'>A value of 0% will select tracks based on how likely they are to appear together in a Spotify user's
          playlist. A value of 100% will select tracks based purely on how they sound.</Text>
        <VerticalSpacer />
        <Row>
          <Col>
            <Text h6><Small>{Math.round(_creativity * 100)}%</Small></Text>
          </Col>
          <Col>
            <HorizontalSpacer />
          </Col>
          <Col style={{ flex: 95 }}>
            <FormRange
              id='creativity'
              type='number'
              min='0'
              max='1'
              step='0.01'
              value={_creativity}
              onChange={event => {
                setCreativity(event.target.value);
                update();
              }}
              onValueChange={value => {
                setCreativity(value);
                update();
              }}
            />
          </Col>
        </Row>
        <Hr />
        <FormLabel htmlFor='noise'>Noise</FormLabel>
        <Text h6 className='text-muted'>Controls the amount of randomness to apply.</Text>
        <VerticalSpacer />
        <Row>
          <Col>
            <Text h6><Small>{Math.round(_noise * 100)}%</Small></Text>
          </Col>
          <Col>
            <HorizontalSpacer />
          </Col>
          <Col style={{ flex: 95 }}>
            <FormRange
              id='noise'
              type='number'
              min='0'
              max='1'
              step='0.01'
              value={_noise}
              onChange={event => {
                setNoise(event.target.value);
                update();
              }}
              onValueChange={value => {
                setNoise(value);
                update();
              }}
            />
          </Col>
        </Row>
        <Hr />
        <Row style={{ justifyContent: 'flex-start' }}>
          <FaBackward
            data-testid='close'
            size='25'
            className='link'
            onClick={() => {
              update();
              onClose();
            }}
          />
        </Row>
      </Card>
    </ScrollView>
  );
}
