import React, { useCallback } from 'react';
import { Text as TEXT } from "react-native-elements";
import { Linking, Alert, Image, View as VIEW, ScrollView as SCROLL_VIEW, ActivityIndicator } from 'react-native';
import { WebView as WEB_VIEW } from 'react-native-webview';
import { useTheme, Card } from 'react-native-paper';
const MD_ICON = require('react-native-vector-icons').MaterialIcons;
const FA_ICON = require('react-native-vector-icons').FontAwesome5;
import { TextInput } from 'react-native-paper';
import { VerticalSpacer } from './Lib';

export { Card };
export { TextInput };

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
      onPress={props.onClick}
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

export function Hr(props) {
  const { colors } = useTheme();

  return (
    <>
      <VerticalSpacer />
      <View
        style={{
          borderBottomColor: colors.primary,
          borderBottomWidth: 1,
          ...props.style
        }}
        {...props}
      />
      <VerticalSpacer />
    </>
  );
}

export function FaIcon(props) {
  const { colors } = useTheme();

  return (
    <Text {...props}>
      <FA_ICON
        name={props.name}
        size={Number(props.size)}
        color={props.className === 'link' ? colors.accent :
          props.className === 'text-muted' ? colors.disabled :
            colors.primary}
      ></FA_ICON >
    </Text>
  );
}

export function FaPlus(props) {
  return <FaIcon name='plus' {...props} />
}

export function FaForward(props) {
  return <FaIcon name='forward' {...props} />
}

export function FaBackward(props) {
  return <FaIcon name='backward' {...props} />
}
export function FaCloudUploadAlt(props) {
  return <FaIcon name='cloud-update-alt' {...props} />
}

export function FaPen(props) {
  return <FaIcon name='pen' {...props} />
}

export function FaSpotify(props) {
  return <FaIcon name='spotify' {...props} />
}

export function FaCog(props) {
  return <FaIcon name='cog' {...props} />
}

export function MdIcon(props) {
  const { colors } = useTheme();

  return (
    <Text {...props}>
      <MD_ICON
        name={props.name}
        size={Number(props.size)}
        color={props.className === 'link' ? colors.accent :
          props.className === 'text-muted' ? colors.disabled :
            colors.primary}
      ></MD_ICON >
    </Text>
  );
}

export function MdStar(props) {
  return <MdIcon name='star' {...props} />
}

export function MdStarHalf(props) {
  return <MdIcon name='star-half' {...props} />
}

export function MdStarBorder(props) {
  return <MdIcon name='star-outline' {...props} />
}
