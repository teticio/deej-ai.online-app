import Col from 'react-bootstrap/Col';
import './Banner.css'

export default function Banner() {
  return (
    <Col className="row align-items-center banner">
        <Col sm="auto">
            <h2><a href="https://deej-ai.online" style={{textDecoration: 'none', color: 'inherit'}}>Deej-A.I.</a></h2>
        </Col>
        <Col sm="auto">
            <h6>by <a href="https://www.linkedin.com/in/attentioncoach/" target="_blank" rel="noreferrer">Robert Smith</a>
            </h6>
        </Col>
    </Col>
  );
}