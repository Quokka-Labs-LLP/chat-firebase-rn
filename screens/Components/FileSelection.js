import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont().then();
import DocumentPicker from 'react-native-document-picker';

function FileSelection({visible, onClose, onSelect}) {
  const [userMembers, setuserMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedFcm, setSelectedfcm] = useState([]);

  const selectMemeber = contect => {
    // const index = selected.indexOf(id);
    // const tokenindex = selectedFcm.indexOf(fcmToken);
    // if (index === -1) {
    //   setSelected([...selected, id]);
    //   setSelectedfcm([...selectedFcm, fcmToken]);
    // } else {
    //   const updatedSelected = selected.filter(itemId => itemId !== id);
    //   const updatedFcm = selectedFcm.filter(itemId => itemId !== fcmToken);
    //   setSelected(updatedSelected);
    //   setSelectedfcm(updatedFcm);
    // }
  };
  const renderCheckIcon = useCallback(
    id => {
      if (selected.indexOf(id) !== -1)
        return (
          <Icon
            name="checkmark-circle"
            color={'#009387'}
            size={30}
            onPress={onClose}
          />
        );
    },
    [selected],
  );
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      style={{flex: 1}}
      animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'images-outline'}
                  size={25}
                  onPress={() => onSelect(DocumentPicker.types.images)}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Images</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'play-circle-outline'}
                  onPress={() => onSelect(DocumentPicker.types.video)}
                  size={25}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Vedios</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'musical-notes-outline'}
                  size={25}
                  onPress={() => onSelect(DocumentPicker.types.audio)}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Audio</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'document-outline'}
                  size={25}
                  onPress={() => onSelect(DocumentPicker.types.pdf)}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Document</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'call-outline'}
                  size={25}
                  onPress={() => onSelect('Contact')}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Contact</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  name={'location-outline'}
                  size={25}
                  color={'grey'}
                  onPress={() => onSelect('Location')}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Location</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default FileSelection;
const styles = StyleSheet.create({
  buttonCancel: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 13,
  },
  card: {
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignContent: 'center',
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    backgroundColor: '#009387',
    justifyContent: 'center',
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
  container: {
    height: '30%',
    width: '80%',
    marginTop: 25,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: '7%',
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  msgContent: {
    paddingTop: 5,
    color: 'black',
  },

  iconStyle: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 25,
    right: 30,
    backgroundColor: '#009387',
    padding: 10,
    borderRadius: 5,
  },
});
