import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { WebView, Spinner } from './Platform'

// Avoid unncessary re-renders
class SpotifyTrackWidgetClass extends PureComponent {
  render() {
    const { track_id, highlight } = this.props;
    const { colors } = this.props.theme;

    return (
      <View style={highlight ? {
        padding: 2,
        backgroundColor: colors.primary
      } : {}}>
        <WebView
          style={{
            flex: 0,
            height: 80,
            backgroundColor: colors.surface
          }}
          startInLoadingState={true}
          renderLoading={() => {
            return (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.surface
                }}
              >
                <Spinner size='large' />
              </View>);
          }}
          source={{
            uri: `https://open.spotify.com/embed/track/${track_id}`
          }}
        />
      </View>
    );
  }
}

// Wrap in a function so as to be able to use hook
function SpotifyTrackWidget(props) {
  const theme = useTheme();

  return <SpotifyTrackWidgetClass {...props} theme={theme} />;
}

export default function Track({
  track_id,
  highlight = false
}) {
  return (
    <SpotifyTrackWidget
      track_id={track_id}
      highlight={highlight}
    />
  );
}
