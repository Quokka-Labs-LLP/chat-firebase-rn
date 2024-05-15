/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Icon.loadFont().then();
import Geolocation from 'react-native-geolocation-service';
import {useTheme} from '@react-navigation/native';

function ShareLoctionCom({visible, onClose, onSelect}) {
  const {primary} = useTheme().colors;
  const [location, setLocation] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);
  const returnUrl = () => {
    //   To open url with custom label ios/android:

    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${location?.coords?.latitude},${location?.coords?.longitude}`;
    const label = 'Sharedlocation';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    // console.log('url', url);
    onSelect(url);
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      //   console.log('granted', granted);
      if (granted === 'granted') {
        // console.log('You can use Geolocation');
        return true;
      } else {
        // console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      //   console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            // console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    // console.log(location);
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      onb
      transparent={true}
      style={{flex: 1}}
      animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View onPress={onClose} style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.container}>
            {/* <Text style={styles.shareLocText}>Location</Text> */}
            {/* <View
              style={[
                styles.shareLocBottom,
                {backgroundColor: primary},
              ]}></View> */}
            <View
              style={{
                width: '80%',
                height: '70%',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  alignSelf: 'center',
                }}
                resizeMode="cover"
                source={require('../../assets/map.jpeg')}
              />
              {/* <MapView
                style={styles.map}
                //specify our coordinates.
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              /> */}
            </View>
            <TouchableOpacity
              onPress={() => returnUrl()}
              style={{alignSelf: 'center', position: 'absolute', bottom: '5%'}}>
              <Text style={[styles.shareLocText, {color: primary}]}>
                Share Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default ShareLoctionCom;
const styles = StyleSheet.create({
  container: {
    height: '70%',
    width: '95%',
    marginTop: 25,
    backgroundColor: 'white',
    borderRadius: 40,
    alignSelf: 'center',
  },
  shareLocText: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 12,
  },
  shareLocBottom: {
    width: '80%',
    height: 1,
    alignSelf: 'center',
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
