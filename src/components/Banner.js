import { useState } from "react";
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import './Banner.css'
import { VerticalSpacer } from "../lib";

export default function Banner({ loggedIn = false, onSelect = f => f }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <VerticalSpacer px={120} />
      <Navbar
        className="banner shadow-lg"
        fixed="top"
        bg="dark"
        variant="dark"
        expand="lg"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand href="#">
            <div className="d-flex flex-row align-items-center">
              <Col sm="auto">
                <span onClick={() => {
                  const accessToken = localStorage.accessToken;
                  const refreshToken = localStorage.refreshToken;
                  localStorage.clear();
                  localStorage.accessToken = accessToken;
                  localStorage.refreshToken = refreshToken;
                  setExpanded(false);
                  onSelect('/');
                }} >
                  <h2>Deej-A.I.&nbsp;&nbsp;</h2>
                </span>
              </Col>
              <Col sm="auto">
                <h6>by <span
                  className="link"
                  onClick={() => window.open("https://www.linkedin.com/in/attentioncoach/")}
                >Robert Smith</span></h6>
              </Col>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!loggedIn ?
                <Nav.Link
                  href="#"
                  onClick={() => {
                    setExpanded(false);
                    onSelect('/login');
                  }}
                >Login to Spotify</Nav.Link> :
                <Nav.Link
                  href="#"
                  onClick={() => {
                    setExpanded(false);
                    onSelect('/logout');
                  }}
                >Logout from Spotify</Nav.Link>}
              <Nav.Link
                href="#"
                onClick={() => {
                  setExpanded(false);
                  onSelect('/');
                }}
              >Create playlist</Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => {
                  setExpanded(false);
                  onSelect('/top');
                }}
              >Top rated playlists</Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => {
                  setExpanded(false);
                  onSelect('/latest');
                }}
              >Latest playlists</Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => {
                  setExpanded(false);
                  onSelect('/search');
                }}
              >Search playlists</Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => {
                  setExpanded(false);
                  onSelect('/about');
                }}
              >About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
