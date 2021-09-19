import React from 'react';
import { Card } from './Platform';
import { Row, Col, createArray, VerticalSpacer } from './Lib';
import ShowPlaylist from './ShowPlaylist';

export default function ShowPlaylists({ playlists, spotify = null }) {
  return (
    <>
      {(playlists.length === 1) ?
        <Card key={0} >
          <ShowPlaylist
            playlist={playlists[0]}
            spotify={spotify}
            userPlaylist={false}
          />
        </Card> :
        createArray(Math.floor((playlists.length + 1) / 2)).map((x, i) => (
          <>
            <Row style={{justifyContent: 'space-between'}}>
              {createArray(2).map((x, j) => (
                (2 * i + j < playlists.length) ?
                  <Col style={{ flex: 1, minWidth: 300  }}>
                    <VerticalSpacer px={10} />
                    <Card key={2 * i + j} style={{margin: 10, padding: 10}} >
                      <ShowPlaylist
                        playlist={playlists[2 * i + j]}
                        spotify={spotify}
                        userPlaylist={false}
                      />
                    </Card>
                  </Col> : <></>
              ))}
            </Row>
          </>
        ))}
    </>
  );
}
