/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont().then();
import DocumentPicker from 'react-native-document-picker';

function FileSelection({visible, onClose, onSelect}) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      style={styles.contain}
      animationType="slide">
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.contain}>
          <View style={styles.container}>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => onSelect(DocumentPicker.types.images)}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'images-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Images</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelect(DocumentPicker.types.video)}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'play-circle-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Video</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => onSelect(DocumentPicker.types.audio)}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'musical-notes-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelect('Camera')}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'camera-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Camera</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => onSelect('Contact')}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'call-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelect(DocumentPicker.types.pdf)}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'document-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Document</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => onSelect('Location')}
                style={{justifyContent: 'center'}}>
                <Icon
                  name={'location-outline'}
                  size={25}
                  color={'black'}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{color: 'black'}}>Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default FileSelection;
const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },
  card: {
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignContent: 'center',
  },
  container: {
    height: '40%',
    width: '80%',
    marginTop: 25,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: '7%',
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
});
