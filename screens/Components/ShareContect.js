import React, {useState, useEffect, useCallback} from 'react';
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
  Linking,
  FlatList,
} from 'react-native';
import Contacts from 'react-native-contacts';

import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont().then();

function ShareContect({visible, onClose, onSelect}) {
  const [contects, setcontects] = useState([]);
  const [selected, setSelected] = useState();

  const getContects = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            // work with contacts
            setcontects(contacts);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };
  useEffect(() => {
    getContects();
  }, []);
  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelected(item)}>
        <View style={styles.contactCon}>
          <View style={styles.imgCon}>
            <View style={styles.placeholder}>
              <Text style={styles.txt}>{item?.givenName[0]}</Text>
            </View>
          </View>
          <View style={styles.contactDat}>
            <Text style={styles.name}>
              {item?.givenName} {item?.middleName && item.middleName + ' '}
              {item?.familyName}
            </Text>
            <Text style={styles.phoneNumber}>
              {item?.phoneNumbers[0]?.number}
            </Text>
          </View>
          {selected &&
          item?.phoneNumbers[0]?.number == selected?.phoneNumbers[0]?.number ? (
            <Icon
              name="checkmark-circle"
              color={'#009387'}
              size={25}
              onPress={onClose}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const ListEmptyComponent = () => {
    return <Text>Loding..</Text>;
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
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.container}>
            <View style={styles.shareLocBottom}></View>
            <View
              style={{
                width: '80%',
                height: '83%',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              <FlatList
                data={contects}
                ListEmptyComponent={ListEmptyComponent}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={{flex: 1}}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                onSelect(
                  selected && {
                    name: selected?.givenName,
                    phone: selected.phoneNumbers[0]?.number,
                  },
                );
              }}
              style={{alignSelf: 'center', position: 'absolute', bottom: '5%'}}>
              <Text style={styles.shareLocText}>Share Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default ShareContect;
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
    color: '#009387',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 12,
  },
  shareLocBottom: {
    width: '80%',
    height: 1,
    backgroundColor: '#009387',
    alignSelf: 'center',
    marginTop: 20,
  },

  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
  },
  imgCon: {
    paddingRight: 10,
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDat: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  txt: {
    fontSize: 18,
    color: 'black',
  },
  name: {
    fontSize: 16,
    color: 'black',
  },
  phoneNumber: {
    color: '#888',
  },
});
