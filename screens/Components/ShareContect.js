/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
// Icon.loadFont().then();

function ShareContect({visible, onClose, onSelect}) {
  const {primary} = useTheme().colors;
  const [contects, setcontects] = useState([]);
  const [selected, setSelected] = useState();

  const getContects = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
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
              <Text style={[styles.txt, {color: primary}]}>
                {item?.givenName[0]}
              </Text>
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
              color={primary}
              size={25}
              onPress={onClose}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  };
  // eslint-disable-next-line react/no-unstable-nested-components
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
            <View
              style={[
                styles.shareLocBottom,
                {backgroundColor: primary},
              ]}></View>
            <View
              style={{
                width: '80%',
                height: '100%',
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
            <View
              style={{
                backgroundColor: primary,
                width: 50,
                height: 50,
                position: 'absolute',
                bottom: 20,
                alignSelf: 'flex-end',
                right: 30,
                borderRadius: 40,
                justifyContent: 'center',
              }}>
              <Icon
                name="checkmark-sharp"
                onPress={() => {
                  onSelect(
                    selected && {
                      name: selected?.givenName,
                      phone: selected.phoneNumbers[0]?.number,
                    },
                  );
                }}
                size={25}
                color="white"
                style={{alignSelf: 'center'}}
              />
            </View>
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
    width: '100%',
    marginTop: 25,
    backgroundColor: 'white',
    borderRadius: 40,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  shareLocBottom: {
    width: '80%',
    height: 1,
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
  },
  name: {
    fontSize: 16,
    color: 'black',
  },
  phoneNumber: {
    color: '#888',
  },
});
