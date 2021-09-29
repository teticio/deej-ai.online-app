import { FaLinkedin, FaFacebook, FaTwitter, FaReddit, FaMedium, FaGithub } from 'react-icons/fa';
import { Link } from './Platform';
import { Col, Row, VerticalSpacer } from './Lib';

try {
  require('./Footer.css');
} catch (e) { }

export default function Footer() {
  return (
    <>
      <VerticalSpacer px={35} />
      <Row className='footer align-items-center bg-secondary'>
        <Col size='sm-3'>
        </Col>
        <Col>
          <Link url='https://www.linkedin.com/shareArticle?&url=https://deej-ai.online'>
            <FaLinkedin size='25' className='link' />
          </Link>
        </Col>
        <Col>
          <Link url='https://www.facebook.com/sharer/sharer.php?u=https://deej-ai.online'>
            <FaFacebook size='25' className='link' />
          </Link>
        </Col>
        <Col>
          <Link url='https://twitter.com/intent/tweet?text=Check%20this%20https://deej-ai.online%20@att_coach'>
            <FaTwitter size='25' className='link' />
          </Link>
        </Col>
        <Col>
          <Link url='https://www.reddit.com/submit?url=https://deej-ai.online&title=Deej-A.I.%20-%20Automatically%20generate%20playlists%20based%20on%20how%20the%20music%20sounds'>
            <FaReddit size='25' className='link' />
          </Link>
        </Col>
        <Col>
          <Link url='https://medium.com/@teticio'>
            <FaMedium size='25' className='link' />
          </Link>
        </Col>
        <Col>
          <Link url='https://github.com/teticio/Deej-A.I.'>
            <FaGithub size='25' className='link' />
          </Link>
        </Col>
        <Col size='sm-3'>
        </Col>
      </Row>
    </>
  );
}
