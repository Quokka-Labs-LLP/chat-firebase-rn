import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Video, ResizeMode} from 'expo-av';
import {checkIfFileExists, getLocalUrl} from '../helper/useFileStystem';

const VideoPlayer = ({Uri}) => {
  const videoRef = useRef(null);
  const [status, setStatus] = React.useState({});
  const [paused, setPaused] = useState(true);
  const [vediouri, setvediouri] = useState(Uri);
  useEffect(() => {
    checkIfFileExists(Uri).then(res => {
      res &&
        getLocalUrl(Uri).then(res => {
          console.log('--------', res);
          // setvediouri(res);
        });
    });
    console.log(vediouri);
  }, []);
  return (
    <View
      style={{
        justifyContent: 'center',
        height: 200,
        width: '100%',
      }}>
      <TouchableWithoutFeedback
        style={{
          justifyContent: 'center',
          height: '100%',
          width: '50%',
        }}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: vediouri,
          }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </TouchableWithoutFeedback>

      <View style={[styles.center, styles.playButton]}>
        {paused && (
          <TouchableOpacity
            style={{height: '100%', width: '100%', justifyContent: 'center'}}
            onPress={() =>
              status.isPlaying
                ? videoRef.current.pauseAsync()
                : videoRef.current.playAsync()
            }>
            {!status.isPlaying && (
              <Icon
                size={35}
                color={'white'}
                name="play"
                style={{alignSelf: 'center'}}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(VideoPlayer);

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  slider: {
    width: Platform.OS == 'android' ? '100%' : '95%',
    marginLeft: Platform.OS === 'ios' ? 10 : 0,
  },
  controls: {
    position: 'absolute',
    width: '100%',
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
