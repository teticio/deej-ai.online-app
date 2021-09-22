import React, { useCallback } from 'react';
import { Text as TEXT } from "react-native-elements";
import { Linking, Alert, Image, View as VIEW, ScrollView as SCROLL_VIEW, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { WebView as WEB_VIEW } from 'react-native-webview';
import { useTheme, Card } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { VerticalSpacer } from './Lib';

const MD_ICON = require('react-native-vector-icons').MaterialIcons;
const FA_ICON = require('react-native-vector-icons').FontAwesome5;

export { Card };
export { TextInput };

export function Spinner(props) {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      color={colors.primary}
      size={(props.size === 'md' || props.size === 'lg') ? 'large' : 'small'}
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
        {...props}
        style={{
          borderBottomColor: colors.primary,
          borderBottomWidth: 1,
          ...props.style
        }}
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
        size={Number(props.size ? props.size : 15)}
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

export function FaSearch(props) {
  return <FaIcon name='search' {...props} />
}

export function FaTimes(props) {
  return <FaIcon name='times' {...props} />
}

export function MdIcon(props) {
  const { colors } = useTheme();

  return (
    <Text {...props}>
      <MD_ICON
        name={props.name}
        size={Number(props.size ? props.size : 15)}
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

export function Container(props) {
  return <View {...props}>{props.children}</View>;
}

export function Select(props) {
  const { colors } = useTheme();

  return (
    <Picker
      {...props}
      itemStyle={{
        color: colors.primary,
        backgroundColor: colors.surface,
        ...props.style,
      }}
      style={{
        color: colors.primary,
        backgroundColor: colors.surface,
        ...props.style,
      }}
    >{props.children}
    </Picker>
  );
}

export function Option(props) {
  return <Picker.Item {...props} />;
}

export function FormLabel(props) {
  return <Text h4 {...props}>{props.children}</Text>;
}

export function FormControl(props) {
  const { colors } = useTheme();

  return (
    <TextInput
      keyboardType={props.type === 'number' ? 'numeric' : 'default'}
      style={{
        color: colors.primary,
        backgroundColor: colors.surface,
        ...props.style,
      }}
      {...props}
      value={String(props.value)}
    />
  );
}

export function FormRange(props) {
  const { colors } = useTheme();

  return (
    <Slider
      style={{
        color: colors.primary,
        backgroundColor: colors.surface,
        ...props.style,
      }}
      {...props}
      minimumValue={Number(props.min)}
      maximumValue={Number(props.max)}
      step={Number(props.step)}
    />
  );
}
