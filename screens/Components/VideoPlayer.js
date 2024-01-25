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
