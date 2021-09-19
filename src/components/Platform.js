import { FaPlus, FaForward, FaBackward, FaCloudUploadAlt, FaPen, FaSpotify, FaCog } from 'react-icons/fa';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';
import { Spinner, Card, Row, Col } from 'react-bootstrap';

export { FaPlus, FaForward, FaBackward, FaCloudUploadAlt, FaPen, FaSpotify, FaCog };
export { MdStar, MdStarHalf, MdStarBorder };
export { Spinner, Card, Row, Col };

export function ScrollView({ children }) {
  return <>{children}</>;
}

export function View(props) {
  return <div {...props}>{props.children}</div>;
}

export function Text(props) {
  return (
    <span
      {...props}
    >{props.h1 ? <h1>{props.children}</h1> :
      props.h2 ? <h2>{props.children}</h2> :
        props.h3 ? <h3>{props.children}</h3> :
          props.h4 ? <h4>{props.children}</h4> :
            props.h5 ? <h5>{props.children}</h5> :
              props.h6 ? <h6>{props.children}</h6> :
                <>{props.children}</>
      }
    </span>
  );
}

export function Small(props) {
  return <small {...props}>{props.children}</small>;
}

export function Link(props) {
  return (
    <a
      {...props}
      href={props.url}
      target='_blank'
      rel='noopener noreferrer'
    >
      {props.text ? <Text
        {...props}
      >{props.text}
      </Text> : <></>}
      {props.source ? <img
        {...props}
        src={props.source}
        alt={props.alt}
      /> : <></>}
    </a>
  );
}
