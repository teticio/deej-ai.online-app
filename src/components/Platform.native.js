import React, { useCallback } from 'react';
import { Text } from "react-native-elements";
import { Linking, Alert, View as VIEW, ScrollView as SCROLL_VIEW, ActivityIndicator } from 'react-native';
import { WebView as WEB_VIEW } from 'react-native-webview';
import { useTheme, Card as CARD } from 'react-native-paper';
import { Icon as MdIcon } from 'react-native-vector-icons/MaterialIcons';
import { Icon as FaIcon } from 'react-native-vector-icons/FontAwesome5';

export function View(props) {
  const { colors } = useTheme();

  return <VIEW
    {...props}
    style={{
      ...props.style,
      color: colors.primary,
      backgroundColor: colors.background,
    }}
  ></VIEW >
}

export function ScrollView(props) {
  const { colors } = useTheme();

  return <SCROLL_VIEW
    {...props}
    style={{
      ...props.style,
      color: colors.primary,
      backgroundColor: colors.background,
    }}
  ></SCROLL_VIEW >
}

export function WebView(props) {
  const { colors } = useTheme();

  return <WEB_VIEW
    {...props}
    style={{
      ...props.style,
      color: colors.primary,
      backgroundColor: colors.background,
    }}
  >{props.children}</WEB_VIEW >
}

export const Spinner = ActivityIndicator;
export const Card = CARD;

export function Link(props) {
  const { colors } = useTheme();
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(props.url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(props.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${props.url}`);
    }
  }, [props.url]);

  return <Text
    onPress={handlePress}
    {...props}
    style={{
      ...props.style,
      color: colors.accent,
      backgroundColor: colors.background,
      textDecorationLine: 'underline'
    }}
  >{props.text}
  </Text>;
}

export function FaPlus({ size }) {
  return <FaIcon name='plus' size={Number(size)} />
}

export function FaForward({ size }) {
  return <FaIcon name='forward' size={Number(size)} />
}

export function FaBackward({ size }) {
  return <FaIcon name='backward' size={Number(size)} />
}

export function FaCloudUploadAlt({ size }) {
  return <FaIcon name='cloud-upload-alt' size={Number(size)} />
}

export function FaPen({ size }) {
  return <FaIcon name='pen' size={Number(size)} />
}

export function FaSpotify({ size }) {
  return <FaIcon name='spotify' size={Number(size)} />
}

export function FaCog({ size }) {
  return <FaIcon name='cog' size={Number(size)} />
}

export function MdStar({ size }) {
  return <MdIcon name='star' size={Number(size)} />
}

export function MdStarHalf({ size }) {
  return <MdIcon name='star-half' size={Number(size)} />
}

export function MdStarBorder({ size }) {
  return <MdIcon name='star-outline' size={Number(size)} />
}
