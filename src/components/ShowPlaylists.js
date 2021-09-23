import React from 'react';
import { Card } from './Platform';
import { Row, Col, createArray, VerticalSpacer } from './Lib';
import ShowPlaylist from './ShowPlaylist';

export default function ShowPlaylists({ playlists, spotify = null }) {
  return (
    <>
      {(playlists.length === 1) ?
        <Card style={{ padding: 15 }}>
          <ShowPlaylist
            key={0}
            playlist={playlists[0]}
            spotify={spotify}
            userPlaylist={false}
          />
        </Card> :
        createArray(Math.floor((playlists.length + 1) / 2)).map((x, i) => (
          <>
            <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {(2 * i + 0 < playlists.length) ?
                <Col style={{ flex: 1, minWidth: 300 }}>
                  <VerticalSpacer />
                  <Card style={{ marginRight: 5, padding: 15 }}>
                    <ShowPlaylist
                      key={2 * i + 0}
                      playlist={playlists[2 * i + 0]}
                      spotify={spotify}
                      userPlaylist={false}
                    />
                  </Card>
                </Col> : <></>
              }
              {(2 * i + 0 < playlists.length) ?
                <Col style={{ flex: 1, minWidth: 300 }}>
                  <VerticalSpacer />
                  <Card style={{ marginLeft: 5, padding: 15 }} >
                    <ShowPlaylist
                      key={2 * i + 1}
                      playlist={playlists[2 * i + 1]}
                      spotify={spotify}
                      userPlaylist={false}
                    />
                  </Card>
                </Col> : <></>
              }
            </Row>
          </>
        ))}
    </>
  );
}
