/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';

const UserAbout = ({user, route, navigation}) => {
  const {item} = route.params;
  const {primary} = useTheme().colors;
  return (
    <View style={styles.Contain}>
      <View style={[styles.userImageSTT, {backgroundColor: primary}]}>
        {item?.profilePic ? (
          <Image
            style={styles.groupImage}
            resizeMode="cover"
            source={{uri: item?.profilePic}}
          />
        ) : (
          <Icon
            style={{alignSelf: 'center'}}
            name={'person'}
            size={55}
            color={'white'}
          />
        )}
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
            color: 'black',
            marginVertical: 10,
            fontSize: 16,
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: 'black',
            fontSize: 16,
          }}>
          {item?.email}
        </Text>
      </View>
    </View>
  );
};
export default UserAbout;

const styles = StyleSheet.create({
  Contain: {
    flex: 1,
    alignItems: 'center',
  },
  userImageSTT: {
    alignSelf: 'center',
    height: '20%',
    width: '40%',
    marginTop: '10%',
    borderRadius: 200,
    justifyContent: 'center',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
});
