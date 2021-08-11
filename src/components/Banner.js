import { useState } from "react";
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import './Banner.css'

export default function Banner({ loggedIn = false, onSelect = f => f }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="no" expanded={expanded}>
        <Container className="banner">
          <Navbar.Brand href="#home">
            <div className="row align-items-center">
              <Col sm="auto">
                <h2><a href="https://deej-ai.online" style={{ textDecoration: 'none', color: 'inherit' }}>Deej-A.I.</a></h2>
              </Col>
              <Col sm="auto">
                <h6>by <a href="https://www.linkedin.com/in/attentioncoach/" target="_blank" rel="noreferrer">Robert Smith</a>
                </h6>
              </Col>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!loggedIn ?
                <Nav.Link href="#link" onClick={() => { setExpanded(false); onSelect('login_spotify'); }}>Login to Spotify</Nav.Link> :
                <></>
              }
              <Nav.Link href="#link" onClick={() => { setExpanded(false); onSelect('create_playlist'); }}>Create playlist</Nav.Link>
              <Nav.Link href="#link" onClick={() => { setExpanded(false); onSelect('popular_playlists'); }}>Popular playlists</Nav.Link>
              <Nav.Link href="#link" onClick={() => { setExpanded(false); onSelect('latest_playlists'); }}>Latest playlists</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}