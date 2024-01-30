import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getUrl,
  timeFormat,
  updateLetestMessage,
  updateMessages,
  fileUploadd,
  getFcmTokens,
  getMessages,
  updateSeenStatus,
  updateseenstatusgroup,
} from './helper/hepler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchCamera} from 'react-native-image-picker';

import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from './Components/InChatFileTransfer';
import InChatViewFile from './Components/InChatViewFile';
import AddUserc from './Components/AddUserc';
import {sendNotification} from './Notification/NotificationController';
import {storage} from './Notification/NotificationController';
import FileSelection from './Components/FileSelection';
import ShareLoctionCom from './Components/ShareLoctionCom';
import ShareContect from './Components/ShareContect';
import DownloadButton from './Components/DownloadButton';
const ChatScreen = ({user, route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const {uid, from, fcmToken, item} = route.params;
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [selecedfiles, setselectedfiles] = useState([]);
  const [filePath, setFilePath] = useState('');
  const [fileVisible, setFileVisible] = useState(false);
  const [visibleFileSlection, setvisibleFileSlection] = useState(false);
  const [visibleShareLoc, setvisibleShareLoc] = useState(false);
  const uploadimageRef = useRef([]);
  const [loding, setloding] = useState(false);
  const [selecteditem, setselecteditem] = useState();
  const [username, setusername] = useState('');
  const [showAddUser, setshowAddUser] = useState(false);
  const [fcmTokenss, setfcmTokens] = useState([]);
  const [sharLocation, setsharLocation] = useState('');
  const [shareContect, setshareContect] = useState(false);
  const [selectedContect, setselectedContect] = useState('');
  useEffect(() => {
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    function onResult(QuerySnapshot) {
      setMessages(getMessages(QuerySnapshot));
      if (from !== 'group') {
        updateSeenStatus(docid, user.uid);
      } else {
        updateseenstatusgroup(uid, user.uid);
      }
    }
    const unsubscribe = firestore()
      .collection(from == 'group' ? 'THREADS' : 'Chats')
      .doc(from == 'group' ? uid : docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(onResult);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      setfcmTokens(getFcmTokens(QuerySnapshot));
    }
    // Assuming userIDs is an array of user IDs you want to fetch
    const unsubscribe = firestore()
      .collection('users')
      .where('uid', 'in', from == 'group' ? fcmToken : [uid])
      .onSnapshot(onResult);
    return () => unsubscribe;
  }, []); // Ensure that the dependency array is empty to mimic componentDidMount behavior

  useEffect(() => {
    storage.set('sessionName', uid);
    return () => {
      storage.delete('sessionName');
    };
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      const querySanp = await firestore()
        .collection('users')
        .where('uid', '==', user.uid)
        .get();
      const allUsers = querySanp.docs.map(docSnap => docSnap.data());
      setusername(allUsers[0].name);
    };
    if (from == 'group') {
      navigation.setOptions({
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            {user.uid == item.createdBy && (
              <Icon
                name="person-add-outline"
                size={25}
                color="white"
                onPress={() => setshowAddUser(!showAddUser)}
                style={{marginRight: 10}}
              />
            )}
            <Icon
              name="ellipsis-vertical"
              size={25}
              color="white"
              onPress={() =>
                navigation.navigate('About', {
                  name: route.params.name,
                  groupitem: item,
                })
              }
              style={{marginRight: 10}}
            />
          </View>
        ),
      });
    }

    getUserName();
  }, []);

  const diccardSelectedFiles = filename => {
    const updatedArry = selecedfiles.filter(item => item.name != filename);
    setselectedfiles(updatedArry);
  };

  const uploadfile = async (uploaduri, messages, index) => {
    try {
      await fileUploadd(uploaduri).then(() => {
        getUrl(uploaduri)
          .then(url => {
            // messages[0]._id =
            //   messages[0]._id + '-' + Math.floor(Date.now() / 1000);
            // onSend(messages, uploaduri, url);
            // setuplodedimagerul(prevUplodedImages => [
            //   ...prevUplodedImages,
            //   url,
            // ]);
            uploadimageRef.current.push(url);
            if (index == selecedfiles.length - 1) {
              console.log('uplodedimagerul=====>>>>>', uploadimageRef.current);
              setselectedfiles([]);
              onSend(messages, uploaduri, url);
            }
          })
          .finally(() => {
            setloding(false);
          });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const _pickDocument = async type => {
    if (type == 'Location') {
      setvisibleFileSlection(!visibleFileSlection);
      setvisibleShareLoc(!visibleShareLoc);
      return;
    }
    if (type == 'Contact') {
      setvisibleFileSlection(!visibleFileSlection);
      setshareContect(!shareContect);
      return;
    }
    if (type == 'Camera') {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          const updatedArray = response.assets.map(item => {
            return {
              ...item,
              fileCopyUri:
                Platform.OS === 'ios'
                  ? item.uri.replace('file://', '')
                  : item.uri,
            };
          });
          setselectedfiles(updatedArray);
          setvisibleFileSlection(false);
          setIsAttachImage(true);
          console.log('selecedfiles,', updatedArray);
        }
      });
      return;
    }
    try {
      const result = await DocumentPicker.pick({
        type: type,
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection:
          type == 'image/*' ? true : type == 'video/*' ? true : false,
      });
      const updatedArray = result.map(item => {
        return {
          ...item,
          fileCopyUri:
            Platform.OS === 'ios'
              ? item.fileCopyUri.replace('file://', '')
              : item.fileCopyUri,
        };
      });
      if (updatedArray.length == 0) {
        return;
      }
      console.log('updatedArray', updatedArray);
      if (
        ['.png', '.jpg', '.mp4', '.mov', '.webp'].some(extension =>
          updatedArray[0].fileCopyUri.includes(extension),
        )
      ) {
        setselectedfiles(updatedArray);
        setvisibleFileSlection(!visibleFileSlection);
        setIsAttachImage(true);
      } else {
        setselectedfiles(updatedArray);
        setvisibleFileSlection(!visibleFileSlection);
        setFilePath(updatedArray[0].fileCopyUri);
        setIsAttachFile(true);
      }
      // setloding(true);
      // uploadfile(fileUri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };

  const renderSend = props => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => setvisibleFileSlection(!visibleFileSlection)}>
          <Icon
            type="font-awesome"
            name="attach"
            style={styles.paperClip}
            size={28}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _pickDocument('Camera')}>
          <Icon
            type="font-awesome"
            name="camera"
            style={styles.paperClip}
            size={28}
            color="black"
          />
        </TouchableOpacity>
        {!loding ? (
          <Send {...props}>
            <View style={styles.sendContainer}>
              <Icon
                type="font-awesome"
                name="send"
                style={styles.sendButton}
                size={25}
                color="#7961C1"
              />
            </View>
          </Send>
        ) : null}
      </View>
    );
  };
  const renderChatFooter = useCallback(() => {
    if (isAttachImage && selecedfiles.length > 0) {
      return (
        <View style={styles.chatFooter}>
          <ScrollView horizontal>
            {selecedfiles.map(item => {
              return (
                <View style={{flexDirection: 'row', marginRight: 10}}>
                  <ImageBackground
                    source={{uri: item.fileCopyUri}}
                    style={{
                      height: 75,
                      width: 75,
                      justifyContent: 'center',
                    }}></ImageBackground>
                  <Icon
                    name={'close-circle-sharp'}
                    onPress={() => diccardSelectedFiles(item.name)}
                    size={20}
                    color={'white'}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      );
    }
    if (isAttachFile) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={filePath} />
          <Icon
            name={'close-circle-sharp'}
            onPress={() => {
              setIsAttachFile(false);
              setFilePath('');
            }}
            size={20}
            color={'white'}
          />
        </View>
      );
    }
    if (sharLocation) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={sharLocation} />
          <Icon
            name={'close-circle-sharp'}
            onPress={() => {
              setsharLocation('');
            }}
            size={20}
            color={'white'}
          />
        </View>
      );
    }
    if (selectedContect) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer
            filePath={`con.${selectedContect.name}. ${selectedContect.phone}`}
          />

          <Icon
            name={'close-circle-sharp'}
            onPress={() => {
              setselectedContect('');
              setshareContect(false);
            }}
            size={20}
            color={'white'}
          />
        </View>
      );
    }
    return null;
  }, [
    filePath,
    loding,
    selecedfiles,
    isAttachImage,
    isAttachFile,
    sharLocation,
    visibleShareLoc,
    shareContect,
    selectedContect,
    uploadimageRef,
  ]);
  const checkPoint = async (messages = []) => {
    setIsAttachImage(false);
    setIsAttachFile(false);
    if (selecedfiles.length == 0) {
      onSend(messages, '', '');
    } else if (selecedfiles.length > 0) {
      setloding(true);
      try {
        for (const [index, file] of selecedfiles.entries()) {
          await uploadfile(file.fileCopyUri, messages, index);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSend = useCallback(
    (messages = [], uploaduri, url) => {
      const [messageToSend] = messages;
      console.log('uploadimageRef -----', uploadimageRef);
      if (
        messageToSend.text != '' ||
        url != '' ||
        sharLocation != '' ||
        selectedContect != ''
      ) {
        setIsAttachImage(false);
        var newMessage = {
          ...messageToSend,
          createdAt: new Date(),
          sentBy: user.uid,
          sentTo: uid,
          seenStatus: false,
          location: sharLocation,
          contact: selectedContect,
          image:
            url != '' && filePath == ''
              ? uploaduri.split('.').pop() == 'mp4'
                ? ''
                : uploadimageRef.current
              : '',
          vedio:
            url != ''
              ? uploaduri.split('.').pop() == 'mp4'
                ? uploadimageRef.current
                : ''
              : '',
          file: {
            url:
              filePath != ''
                ? filePath.split('.').pop() == 'pdf' ||
                  filePath.split('.').pop() == 'mp3'
                  ? url
                  : ''
                : '',
            type: filePath ? filePath.split('.').pop() : '',
          },
        };
        console.log('newMessage------', newMessage);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
        const docid =
          uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
        updateLetestMessage(from, uid, docid, newMessage);
        updateMessages(from, uid, docid, newMessage);
        setFilePath('');
        setIsAttachFile(false);
        setsharLocation('');
        setselectedContect('');
        setshareContect(false);
        uploadimageRef.current = [];
        sendNotification(
          newMessage.text != ''
            ? newMessage.text
            : newMessage.image != ''
            ? 'image'
            : newMessage.contact
            ? 'Contact'
            : newMessage.file.url != ''
            ? newMessage.file.type
            : '',
          fcmTokenss,
          `New Message From ${username}`,
          from == 'group' ? uid : user.uid,
        );
      }
    },
    [
      filePath,
      isAttachFile,
      isAttachImage,
      username,
      sharLocation,
      selectedContect,
      fcmTokenss,
      uploadimageRef,
    ],
  );
  //
  const renderBubble = useCallback(
    props => {
      const {currentMessage} = props;
      // return funtion for attached vedio,audio and pdf massages
      if (
        (currentMessage.file && currentMessage.file.url) ||
        currentMessage.vedio ||
        currentMessage.location ||
        currentMessage.contact ||
        currentMessage.image
      ) {
        return (
          <TouchableOpacity
            disabled={
              (currentMessage.vedio && currentMessage.vedio.length == 1) ||
              currentMessage?.file?.type == 'mp3'
                ? true
                : false
            }
            style={{
              ...styles.fileContainer,
              backgroundColor:
                props.currentMessage.user._id === user.uid
                  ? '#7961C1'
                  : 'lightgrey',
              borderBottomLeftRadius:
                props.currentMessage.user._id === user.uid ? 15 : 5,
              borderBottomRightRadius:
                props.currentMessage.user._id === user.uid ? 5 : 15,
              right:
                props.currentMessage.user._id === user.uid
                  ? 0
                  : currentMessage.vedio
                  ? '17%'
                  : currentMessage.image
                  ? '17%'
                  : '35%',
            }}
            onPress={() => {
              if (currentMessage.location) {
                Linking.openURL(currentMessage.location);
              } else if (currentMessage.contact) {
                if (Platform.OS !== 'android') {
                  phoneNumber = `telprompt:${currentMessage.contact.phone}`;
                } else {
                  phoneNumber = `tel:${currentMessage.contact.phone}`;
                }
                Linking.openURL(phoneNumber);
              } else {
                setFileVisible(!fileVisible);
                setselecteditem(currentMessage);
              }
            }}>
            <InChatFileTransfer
              style={{marginTop: -10}}
              filePath={
                currentMessage.vedio
                  ? 'ved'
                  : currentMessage.location
                  ? currentMessage.location
                  : currentMessage.contact
                  ? `con.${currentMessage.contact.name}.${currentMessage.contact.phone}`
                  : currentMessage.image
                  ? 'img'
                  : currentMessage.file.url
              }
              imediaArry={
                currentMessage.image
                  ? currentMessage.image
                  : currentMessage.vedio
                  ? currentMessage.vedio
                  : []
              }
            />
            <Text
              style={{
                ...styles.fileText,
                color: currentMessage.user._id === user.uid ? 'white' : 'black',
              }}>
              {currentMessage.text}
            </Text>
            <View style={styles.msgTimetextCon}>
              <Text style={styles.msgTimetext}>
                {props.currentMessage.user._id !== user.uid &&
                  currentMessage.user.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.msgTimetext,
                    {
                      color:
                        props.currentMessage.user._id == user.uid
                          ? 'white'
                          : 'black',
                    },
                  ]}>
                  {timeFormat(currentMessage.createdAt)}
                </Text>
                {props.currentMessage.user._id == user.uid ? (
                  <Icon
                    name="checkmark-done"
                    size={15}
                    color={currentMessage.seenStatus ? 'skyblue' : 'white'}
                    style={{padding: 4}}
                  />
                ) : (
                  currentMessage.vedio.length == 1 && (
                    <DownloadButton filePath={currentMessage.vedio[0]} />
                  )
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      // return funtion for only text and attached images massages
      return (
        <Bubble
          {...props}
          renderUsernameOnMessage={from == 'group' ? true : false}
          wrapperStyle={{
            right: {
              backgroundColor: '#7961C1',
            },
            left: {
              backgroundColor: 'lightgrey',
              right: '13%',
            },
          }}
          textStyle={{
            right: {
              color: '#efefef',
            },
          }}
        />
      );
    },
    [fileVisible, selecteditem],
  );
  // for scrolling mssages to the most recent
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };
  renderTicks = currentMessage => {
    if (currentMessage.user._id !== user.uid) {
      return;
    }
    return (
      <View>
        <Icon
          name="checkmark-done"
          size={15}
          color={currentMessage.seenStatus ? 'skyblue' : 'white'}
          style={{padding: 4}}
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <GiftedChat
        style={{flex: 1}}
        messages={messages}
        onSend={text => checkPoint(text)}
        renderChatFooter={renderChatFooter}
        renderTicks={renderTicks}
        renderSend={renderSend}
        user={{
          _id: user.uid,
          name: username,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                borderTopColor: '#7961C1',
              }}
              textInputStyle={{
                color: 'black',
              }}
            />
          );
        }}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />

      {/* view Component for attached pdf files and vedios */}
      {fileVisible ? (
        <InChatViewFile
          props={selecteditem}
          visible={fileVisible}
          filee={selecteditem}
          onClose={() => setFileVisible(!fileVisible)}
        />
      ) : null}

      {/* add users in the group Component */}
      <AddUserc
        visible={showAddUser}
        props={user}
        groupId={uid}
        onClose={() => setshowAddUser(false)}
      />
      {/* File Selection Model */}
      <FileSelection
        visible={visibleFileSlection}
        onClose={() => setvisibleFileSlection(false)}
        onSelect={val => _pickDocument(val)}
      />
      {/* Loction Share Component */}
      {visibleShareLoc && (
        <ShareLoctionCom
          visible={visibleShareLoc}
          onClose={() => setvisibleShareLoc(false)}
          onSelect={val => {
            setvisibleShareLoc(false);
            setsharLocation(val);
          }}
        />
      )}
      {/* Contect Share Component */}
      {shareContect && (
        <ShareContect
          visible={shareContect}
          onClose={() => setshareContect(false)}
          onSelect={val => {
            setshareContect(false);
            val && setselectedContect(val);
          }}
        />
      )}
    </View>
  );
};
export default ChatScreen;

export const styles = StyleSheet.create({
  Contain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 4,
    marginVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  userText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Verdana',
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  msgTime: {
    textAlign: 'right',
    fontSize: 11,
    marginTop: -20,
  },
  msgContent: {
    paddingTop: 5,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  sendContainer: {
    padding: 8,
  },
  video: {
    width: '92%',
    aspectRatio: 16 / 9,
    marginTop: 10,
    marginLeft: '4%',
    marginRight: '4%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  paperClip: {
    padding: 8,
  },
  chatFooter: {
    backgroundColor: '#7961C1',
    flexDirection: 'row',
    padding: 7,
  },
  textFooterChat: {
    backgroundColor: 'lightblack',
    borderRadius: 40,
    color: 'white',
    width: 20,
    height: 20,
    justifyContent: 'center',
  },
  msgTimetext: {
    alignSelf: 'flex-end',
    margin: 4,
    fontSize: 12,
    backgroundColor: 'transparent',
    color: 'black',
  },
  msgTimetextCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '96%',
    alignSelf: 'center',
  },
});
