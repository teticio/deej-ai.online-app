import React from 'react';
import { View, Text } from './Platform';
import { useState, useEffect } from 'react';

export const createArray = length => (length > 0) ? [...Array(length)] : [];

export const getHashParams = hash => {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = hash;
  while ((e = r.exec(q)) !== null) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

var timerId = null;

export const debounceFunction = function (func, delay) {
  if (timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(func, delay)
}

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export function VerticalSpacer({ px = 10 }) {
  return (
    <View style={{ marginTop: px }} />
  );
}

export function HorizontalSpacer({ px = 10 }) {
  return (
    <View style={{ width: px }} />
  );
}

export function B(props) {
  return <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>;
}

export function I(props) {
  return <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>;
}

export function Row(props) {
  return (
    <View
      {...props}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        ...props.style
      }}
    >{props.children}
    </View>
  );
}

export function Col(props) {
  return (
    <View
      {...props}
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...props.style
      }}
    >{props.children}
    </View>
  );
}

export function isElectron() {
  return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
}
