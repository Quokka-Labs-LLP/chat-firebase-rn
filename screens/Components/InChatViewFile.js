import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/AntDesign';
import DownloadButton from './DownloadButton';

function InChatViewFile({props, visible, filee, onClose}) {
  const source = {uri: props.file.url, cache: true};
  const imaages = props.image;
  const renderItem = item => {
    return (
      <View
        style={[
          styles.pdf,
          {
            width: Dimensions.get('window').width - 20,
            justifyContent: 'center',
            height: Dimensions.get('window').height - 100,
          },
        ]}>
        <Image
          source={{uri: item.item}}
          resizeMode="contain"
          style={{
            height: '100%',
            width: Dimensions.get('window').width - 25,
          }}
        />
        <View
          style={{
            backgroundColor: '#7961C1',
            width: 50,
            height: 50,
            alignItems: 'center',
            borderRadius: 40,
            position: 'absolute',
            bottom: '5%',
            justifyContent: 'center',
            right: 10,
          }}>
          <DownloadButton filePath={item.item} />
        </View>
      </View>
    );
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      style={{height: 600}}>
      <View style={styles.container}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Icon name={'close'} onPress={onClose} size={25} color={'black'} />
          {imaages.length == 0 && <DownloadButton filePath={source.uri} />}
        </View>

        {props.file.url && (
          <Pdf
            trustAllCerts={false}
            source={source}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        )}
        {props.image.length > 0 && (
          <FlatList
            data={props.image}
            keyExtractor={item => item}
            horizontal
            renderItem={renderItem}
          />
        )}
      </View>
    </Modal>
  );
}
export default InChatViewFile;
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
  textBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  video: {
    width: '99%',
    aspectRatio: 16 / 9,
    marginTop: 10,
    marginLeft: '4%',
    marginRight: '4%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'lightgrey',
  },
});
