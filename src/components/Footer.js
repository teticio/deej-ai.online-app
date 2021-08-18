import { FaLinkedin, FaFacebook, FaTwitter, FaReddit, FaMedium, FaGithub } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Footer.css'

export default function Footer() {
  return (
    <>
      <div style={{ marginTop: '35px' }} />
      <Row className="footer align-items-center bg-secondary">
        <Col size="sm-3">
        </Col>
        <Col>
          <a
            href="https://www.linkedin.com/shareArticle?&url=https://deej-ai.online"
            target="_blank"
            rel="noreferrer"
          ><FaLinkedin size="25" className="link" />
          </a>
        </Col>
        <Col>
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://deej-ai.online"
            target="_blank"
            rel="noreferrer"
          ><FaFacebook size="25" className="link" /></a>
        </Col>
        <Col>
          <a
            href="https://twitter.com/intent/tweet?text=Check%20this%20https://deej-ai.online%20@att_coach"
            target="_blank"
            rel="noreferrer"
          ><FaTwitter size="25" className="link" /></a>
        </Col>
        <Col>
          <a
            href="https://www.reddit.com/submit?url=https://deej-ai.online&title=Deej-A.I.%20-%20Automatically%20generate%20playlists%20based%20on%20how%20the%20music%20sounds"
            target="_blank"
            rel="noreferrer"
          ><FaReddit size="25" className="link" /></a>
        </Col>
        <Col>
          <a
            href="https://medium.com/@teticio"
            target="_blank"
            rel="noreferrer"
          ><FaMedium size="25" className="link" /></a>
        </Col>
        <Col>
          <a
            href="https://github.com/teticio/Deej-A.I."
            target="_blank"
            rel="noreferrer"
          ><FaGithub size="25" className="link" /></a>
        </Col>
        <Col size="sm-3">
        </Col>
      </Row>
    </>
  );
}
