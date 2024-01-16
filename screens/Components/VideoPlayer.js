import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Video, {LoadError, VideoRef} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import VideoPlayerr from 'react-native-video-player';

const VideoPlayer = ({Uri}) => {
  const [priloading, setpriloading] = useState(true);

  return (
    <View style={{flex: 1}}>
      <VideoPlayerr
        video={{uri: Uri}}
        resizeMode={'cover'}
        customStyles={{
          controls: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
          },
        }}
        // videoWidth={1600}
        // videoHeight={800}
        thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
      />
    </View>
  );
};

export default React.memo(VideoPlayer);

const styles = StyleSheet.create({
  video: {
    width: '92%',
    aspectRatio: 16 / 9,
    marginTop: 10,
    marginLeft: '4%',
    marginRight: '4%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',

    bottom: 40,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // Additional styles for your play button
  },
});
