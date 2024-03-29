import React, { useState } from 'react';

import {
  FaPlus, FaForward, FaBackward, FaCloudUploadAlt,
  FaPen, FaSpotify, FaCog, FaSearch, FaTimes
} from 'react-icons/fa';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';
import { Container, Card, Spinner, Form, Navbar, Nav } from 'react-bootstrap';

export {
  FaPlus, FaForward, FaBackward, FaCloudUploadAlt,
  FaPen, FaSpotify, FaCog, FaSearch, FaTimes
};
export { MdStar, MdStarHalf, MdStarBorder };
export { Container, Card, Spinner, Form, Navbar, Nav };

export function ReactJSOnly(props) {
  return <>{props.children}</>;
}

export function ReactNativeOnly(props) {
  return <></>;
}

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
      {props.children}
    </a>
  );
}

export function Hr(props) {
  return <hr />
}

export function TextInput(props) {
  return <input {...props} />;
}

export function Select(props) {
  return <select {...props}>{props.children}</select>;
}

export function Option(props) {
  return <option {...props}>{props.label}</option>;
}

export function Ul(props) {
  return <ul {...props}>{props.children}</ul>;
}

export function Li(props) {
  return <li {...props}>{props.children}</li>;
}

export function IFrame(props) {
  const [visibility, setVisibility] = useState('hidden');

  return (
    <iframe
      style={{
        visibility: visibility
      }}
      onLoad={() => setVisibility('visible')}
      title={props.title}
      {...props}
    />
  );
}

export function Image(props) {
  return <img alt='alt' src={props.source} {...props} />;
}
