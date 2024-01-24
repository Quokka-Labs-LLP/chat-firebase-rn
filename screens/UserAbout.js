import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const UserAbout = ({user, route, navigation}) => {
  const {name, item} = route.params;
  console.log('-------------item', item);

  return (
    <View style={styles.Contain}>
      <View style={styles.userImageSTT}>
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
    backgroundColor: '#7961C1',
    height: '20%',
    width: '40%',
    marginTop: '10%',
    borderRadius: 200,
    justifyContent: 'center',
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    backgroundColor: '#7961C1',
    justifyContent: 'center',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  textArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 300,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Verdana',
    color: 'black',
  },
});
