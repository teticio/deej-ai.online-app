import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { WebView, Spinner } from './Platform'

// Avoid unncessary re-renders
class SpotifyTrackWidget extends PureComponent {
  render() {
    const { track_id, highlight } = this.props;

    return (
      <View style={highlight ? {
        backgroundColor: 'solid white',
        padding: 2
      } : {}}>
        <WebView
          style={{
            flex: 0,
            height: 80,
          }}
          startInLoadingState={true}
          renderLoading={() => {
            return (
              <View style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Spinner size='large' color='solid black' />
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
