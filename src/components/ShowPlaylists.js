import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';
import { createArray, VerticalSpacer } from '../lib';
import ShowPlaylist from './ShowPlaylist';

export default function ShowPlaylists({ playlists, spotify = null }) {
  return (
    <>
      {(playlists.length === 1) ?
        <Card key={0} >
          <Card.Body>
            <ShowPlaylist
              playlist={playlists[0]}
              spotify={spotify}
              userPlaylist={false}
            />
          </Card.Body>
        </Card> :
        createArray(Math.floor((playlists.length + 1) / 2)).map((x, i) => (
          <>
            <Row>
              {createArray(2).map((x, j) => (
                (2 * i + j < playlists.length) ?
                  <Col lg="6">
                    <VerticalSpacer px={10} />
                    <Card key={2 * i + j} >
                      <Card.Body>
                        <ShowPlaylist
                          playlist={playlists[2 * i + j]}
                          spotify={spotify}
                          userPlaylist={false}
                        />
                      </Card.Body>
                    </Card>
                  </Col> : <></>
              ))}
            </Row>
          </>
        ))}
    </>
  );
}
