// import React, {useCallback, useRef, useState, useEffect} from 'react';
// import {StyleSheet, View} from 'react-native';
// import {checkIfFileExists, getLocalUrl} from '../helper/useFileStystem';
// import VideoPlayerr from 'react-native-video-player';
// import Video from 'react-native-video';

// const VideoPlayer = ({Uri}) => {
//   const [vediouri, setvediouri] = useState(Uri);
//   useEffect(() => {
//     checkIfFileExists(Uri).then(res => {
//       res &&
//         getLocalUrl(Uri).then(res => {
//           setvediouri(res);
//         });
//     });
//     console.log(vediouri);
//   }, []);
//   return (
//     <View style={{flex: 1}}>
//       {/* <VideoPlayerr
//         video={{uri: vediouri}}
//         resizeMode={'cover'}
//         customStyles={{
//           controls: {
//             backgroundColor: 'rgba(0, 0, 0, 0.0)',
//           },
//         }}
//         thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
//       /> */}
//       <Video source={{uri: "background"}}   // Can be a URL or a local file.
//        ref={(ref) => {
//          player = ref
//        }}                                      // Store reference
//        onBuffer={onBuffer}                // Callback when remote video is buffering
//        onError={videoError}               // Callback when video cannot be loaded
//        style={styles.backgroundVideo} />
//     </View>
//   );
// };

// export default React.memo(VideoPlayer);

// const styles = StyleSheet.create({
//   video: {
//     width: '92%',
//     aspectRatio: 16 / 9,
//     marginTop: 10,
//     marginLeft: '4%',
//     marginRight: '4%',
//     alignSelf: 'center',
//     justifyContent: 'center',
//   },
//   controls: {
//     position: 'absolute',

//     bottom: 40,
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     // Additional styles for your play button
//   },
//   backgroundVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   }
// });

import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Video, {LoadError, OnProgressData} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';

const VideoPlayer = ({Uri}) => {
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState({
    playableDuration: 0,
    currentTime: 0,
    seekableDuration: 0,
  });
  console.log('Uri', Uri);
  // useEffect(() => {
  //   setPaused(videoItem?.id == item?.id ? false : true);
  // }, [videoItem?.id, item?.id]);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const onProgress = data => {
    setCurrentTime(data.currentTime);
    setDuration(data?.seekableDuration);
  };

  const onEnd = () => {
    setCurrentTime(duration);
  };

  const onSliderValueChange = value => {
    setCurrentTime(value);
    // setIsSeeking(true);
  };

  const onSliderSlidingComplete = value => {
    videoRef.current?.seek(value);
    // setIsSeeking(false);
  };

  const onLoad = data => {
    setCurrentTime(data?.currentTime);
    setDuration(data?.duration);
  };
  return (
    <View style={{justifyContent: 'center', height: 200, width: '100%'}}>
      <TouchableWithoutFeedback
        style={{justifyContent: 'center', height: '100%', width: '50%'}}
        onPress={() => {
          // if (videoEnded) {
          //   videoRef.current?.seek(0);
          //   setVideoEnded(false);
          // }
          setPaused(!paused);
        }}>
        <Video
          paused={paused}
          ref={videoRef}
          source={{uri: Uri}}
          style={styles.video}
          onLoad={onLoad}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </TouchableWithoutFeedback>

      {paused && (
        <View style={[styles.center, styles.playButton]}>
          <TouchableOpacity
            onPress={() => {
              setPaused(!paused);
            }}>
            <Icon size={35} color={'white'} name="play" />
          </TouchableOpacity>
        </View>
      )}
      {/* {hideSeek && ( */}
      <View style={styles.controls}>
        <Slider
          tapToSeek={true}
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={onSliderValueChange}
          onSlidingComplete={onSliderSlidingComplete}
          minimumTrackTintColor="red"
          maximumTrackTintColor="grey"
          thumbTintColor={'grey'}
          onResponderGrant={() => (Platform.OS == 'android' ? true : false)}
        />
      </View>
      {/* )} */}
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
