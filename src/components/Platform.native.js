import 'react-native-gesture-handler';
import React, { useCallback, Component, createContext, Children, cloneElement } from 'react';
import { Linking, Alert, Image, View as VIEW, ScrollView as SCROLL_VIEW, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text as TEXT } from "react-native-elements";
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { WebView as WEB_VIEW } from 'react-native-webview';
import { useTheme, Card, TextInput, Appbar, Menu } from 'react-native-paper';

const MD_ICON = require('react-native-vector-icons').MaterialIcons;
const FA_ICON = require('react-native-vector-icons').FontAwesome5;

export { Card };
export { TextInput };

export const getHashParams = () => {
  return '';
};

export function ReactJSOnly(props) {
  return <></>;
}

export function ReactNativeOnly(props) {
  return <>{props.children}</>;
}

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
        color: props.className === 'link' ? colors.accent :
          props.className === 'text-muted' ? colors.disabled :
            colors.primary,
        ...props.style,
      }}
    ></TEXT >
  );
}

export function Small(props) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={{
        fontSize: 12,
        color: props.className === 'link' ? colors.accent :
          props.className === 'text-muted' ? colors.disabled :
            colors.primary,
        ...props.style,
      }}
    >{props.children}
    </Text >
  );
}

export function View(props) {
  const { colors } = useTheme();

  return (
    <VIEW
      {...props}
      style={{
        color: colors.primary,
        backgroundColor: props.surface ? colors.surface : colors.background,
        ...props.style,
      }}
    ></VIEW >
  );
}

export function ScrollView(props) {
  const { colors } = useTheme();

  return (
    <SCROLL_VIEW
      {...props}
      style={{
        color: colors.primary,
        backgroundColor: colors.background,
        ...props.style,
      }}
    >
      {props.children}
    </SCROLL_VIEW >
  );
}

export function WebView(props) {
  const { colors } = useTheme();

  return (
    <WEB_VIEW
      {...props}
      style={{
        color: colors.primary,
        backgroundColor: colors.surface,
        ...props.style,
      }}
    >{props.children}</WEB_VIEW >
  );
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
      <View style={{ marginTop: 10 }} />
      <View
        {...props}
        style={{
          borderBottomColor: colors.primary,
          borderBottomWidth: 1,
          ...props.style
        }}
      />
      <View style={{ marginTop: 10 }} />
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
  return <FaIcon name='cloud-upload-alt' {...props} />
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
  return <>{props.children}</>;
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

export class Form {
  static Label(props) {
    return <Text h4 {...props}>{props.children}</Text>;
  }

  static Control(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

  static Range(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
}

export class Navbar extends Component {
  render() {
    return (
      <Appbar.Header
        style={{
          backgroundColor: '#00bc8c',
          ...this.props.style
        }}
        {...this.props}
      >{this.props.children}
      </Appbar.Header>
    );
  }

  static Brand(props) {
    return <Appbar.Content {...props} />;
  }

  static Toggle(props) {
    return <></>;
  }

  static Collapse(props) {
    return <>{props.children}</>;
  }
}

const ParentContext = createContext(null);

export class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.setVisible = this.setVisible.bind(this);
  }

  setVisible(value) {
    this.setState({ visible: value });
  }

  render() {
    return (
      <Menu
        visible={this.state.visible}
        onDismiss={() => this.setVisible(false)}
        anchor={
          <Appbar.Action
            icon="menu"
            color="white"
            onPress={() => this.setVisible(true)}
          />
        }
        {...this.props}
      >
        <ParentContext.Provider value={{ setVisible: this.setVisible }}>
          {this.props.children}
        </ParentContext.Provider>
      </Menu>
    )
  };

  static Link(props) {
    return (
      <ParentContext.Consumer>{context =>
        <Menu.Item
          onPress={() => {
            context.setVisible(false);
            props.onClick();
          }}
          title={props.children}
        />}
      </ParentContext.Consumer>
    );
  }
}

export function Ul(props) {
  return (
    <Text
      {...props}
    >{Children.map(props.children, (child, index) => (
      <>
        {(index > 0) ? <Text>{'\n'}</Text> : <></>}
        {cloneElement(child)}
      </>
    ))}
    </Text>
  );
}

export function Li(props) {
  return <Text {...props}>{'   \u2022 '}{props.children}</Text>;
}

const Stack = createStackNavigator();

export function Routes(props) {
  return (
    <Stack.Navigator
      initialRouteName='/'
      {...props}
    >{props.children}
    </Stack.Navigator>
  );
}

export function Route(props) {
  return (
    <Stack.Screen
      name={props.path}
      component={props.element}
      {...props}
    >{props.children}
    </Stack.Screen>
  );
}
