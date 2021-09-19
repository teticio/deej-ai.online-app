import React, { useCallback } from 'react';
import { Text as TEXT } from "react-native-elements";
import { Linking, Alert, Image, View as VIEW, ScrollView as SCROLL_VIEW, ActivityIndicator } from 'react-native';
import { WebView as WEB_VIEW } from 'react-native-webview';
import { useTheme, Card } from 'react-native-paper';
const MdIcon = require('react-native-vector-icons').MaterialIcons;
const FaIcon = require('react-native-vector-icons').FontAwesome5;

export { Card };

export function Spinner(props) {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      color={colors.primary}
      {...props}
    ></ActivityIndicator >
  );
}

export function Text(props) {
  const { colors } = useTheme();

  return (
    <TEXT
      {...props}
      style={{
        color: props.className === 'link' ? colors.accent : colors.primary,
        ...props.style,
      }}
    ></TEXT >
  );
}

export function Small(props) {
  return <>{props.children}</>;
}

export function View(props) {
  const { colors } = useTheme();

  return <VIEW
    {...props}
    style={{
      color: colors.primary,
      backgroundColor: props.surface ? colors.surface : colors.background,
      ...props.style,
    }}
  ></VIEW >
}

export function ScrollView(props) {
  const { colors } = useTheme();

  return <SCROLL_VIEW
    {...props}
    style={{
      color: colors.primary,
      backgroundColor: colors.background,
      ...props.style,
    }}
  ></SCROLL_VIEW >
}

export function WebView(props) {
  const { colors } = useTheme();

  return <WEB_VIEW
    {...props}
    style={{
      color: colors.primary,
      backgroundColor: colors.surface,
      ...props.style,
    }}
  >{props.children}</WEB_VIEW >
}

export function Link(props) {
  const { colors } = useTheme();
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(props.url);

    if (supported) {
      await Linking.openURL(props.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${props.url}`);
    }
  }, [props.url]);

  if (props.text) {
    return (
      <Text
        onPress={handlePress}
        style={{
          color: colors.accent,
          backgroundColor: colors.surface,
          textDecorationLine: 'underline'
        }}
      >{props.text ? props.text : ''}
      </Text>
    );
  } else {
    return (
      <Image
        onPress={handlePress}
        source={props.source}
        resizeMode='contain'
        {...props}
      ></Image>
    );
  }
}

export function FaPlus({ size = 10 }) {
  return <FaIcon name='plus' size={Number(size)} />
}

export function FaForward({ size = 10 }) {
  return <FaIcon name='forward' size={Number(size)} />
}

export function FaBackward({ size = 10 }) {
  return <FaIcon name='backward' size={Number(size)} />
}

export function FaCloudUploadAlt({ size = 10 }) {
  return <FaIcon name='cloud-upload-alt' size={Number(size)} />
}

export function FaPen({ size = 10 }) {
  return <FaIcon name='pen' size={Number(size)} />
}

export function FaSpotify({ size = 10 }) {
  return <FaIcon name='spotify' size={Number(size)} />
}

export function FaCog({ size = 10 }) {
  return <FaIcon name='cog' size={Number(size)} />
}

export function MdStar({ size = 10 }) {
  return <MdIcon name='star' size={Number(size)} />
}

export function MdStarHalf({ size = 10 }) {
  return <MdIcon name='star-half' size={Number(size)} />
}

export function MdStarBorder({ size = 10 }) {
  return <MdIcon name='star-outline' size={Number(size)} />
}
