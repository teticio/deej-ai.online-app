import React, { useState } from 'react';
import { ReactJSOnly, Container, Navbar, Nav, Text } from './Platform';
import { Col, Row, VerticalSpacer } from './Lib';

try {
  require('./Banner.css');
} catch (e) { }

export default function Banner({ loggedIn = false, onSelect = f => f, subtitle = null }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ReactJSOnly><VerticalSpacer px={120} /></ReactJSOnly>
      <Navbar
        className='banner shadow-lg'
        fixed='top'
        bg='dark'
        variant='dark'
        expand='lg'
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand
            href='#'
            title='Deej-A.I.'
            subtitle={subtitle ? subtitle : 'by Robert Dargavel Smith'}
          >
            <Row>
              <Col sm='auto'>
                <Text h2 onClick={() => {
                  const accessToken = localStorage.accessToken;
                  const refreshToken = localStorage.refreshToken;
                  localStorage.clear();
                  localStorage.accessToken = accessToken;
                  localStorage.refreshToken = refreshToken;
                  setExpanded(false);
                  onSelect('/');
                }}>Deej-A.I.&nbsp;&nbsp;
                </Text>
              </Col>
              <Col sm='auto'>
                <Text h6>by <Text
                  className='link'
                  onClick={() => window.open('https://www.linkedin.com/in/attentioncoach/')}
                >Robert Smith
                </Text></Text>
              </Col>
            </Row>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls='basic-navbar-nav'
            onClick={() => setExpanded(expanded ? false : 'expanded')}
          />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              {!loggedIn ?
                <Nav.Link
                  href='#'
                  onClick={() => {
                    setExpanded(false);
                    onSelect('/login');
                  }}
                >Login to Spotify
                </Nav.Link> :
                <Nav.Link
                  href='#'
                  onClick={() => {
                    setExpanded(false);
                    onSelect('/logout');
                  }}
                >Logout from Spotify
                </Nav.Link>}
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/');
                }}
              >Create playlist
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/top');
                }}
              >Top rated playlists
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/latest');
                }}
              >Latest playlists
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/most_uploaded');
                }}
              >Most uploaded playlists
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/search');
                }}
              >Search playlists
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => {
                  setExpanded(false);
                  onSelect('/about');
                }}
              >About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
