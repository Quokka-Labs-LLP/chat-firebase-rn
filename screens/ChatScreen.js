import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import storagee from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from './Components/InChatFileTransfer';
import InChatViewFile from './Components/InChatViewFile';
import AddUserc from './Components/AddUserc';
import {sendNotification} from './Notification/NotificationController';
import {storage} from './Notification/NotificationController';
const ChatScreen = ({user, route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const {uid, from, fcmToken, item} = route.params;
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [fileVisible, setFileVisible] = useState(false);
  const [priloading, setpriloading] = useState(true);
  const [transe, setTransferred] = useState();
  const [uplodedimagerul, setuplodedimagerul] = useState('');
  const [loding, setloding] = useState(false);
  const [selecteditem, setselecteditem] = useState();
  const [username, setusername] = useState('');
  const [showAddUser, setshowAddUser] = useState(false);
  const [fcmTokenss, setfcmTokens] = useState([]);
  useEffect(() => {
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    function onResult(QuerySnapshot) {
      try {
        const allTheMsgs = QuerySnapshot.docs.map(docSanp => {
          // console.log("docSanp==",docSanp.data())
          return {
            ...docSanp.data(),
            createdAt: docSanp.data()?.createdAt?.toDate(),
          };
        });
        setMessages(allTheMsgs);
      } catch (error) {
        console.log('docSanp==', error);
      }
    }
    const unsubscribe = firestore()
      .collection(from == 'group' ? 'THREADS' : 'Chats')
      .doc(from == 'group' ? uid : docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(onResult);
    return () => unsubscribe;
  }, []);
  useEffect(() => {
    function onResult(QuerySnapshot) {
      try {
        const fcmtokens = QuerySnapshot.docs
          .filter(
            docSnap =>
              docSnap.data().fcmToken !== storage.getString('fcmtoken'),
          )
          .map(docSnap => docSnap.data().fcmToken);
        setfcmTokens(fcmtokens);
      } catch (error) {
        console.log('docSnap==', error);
      }
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

  const geturl = async filename => {
    console.log('get url....');
    let imageRef = storagee().ref('/' + filename);
    imageRef
      .getDownloadURL()
      .then(url => {
        setuplodedimagerul(url);
      })
      .catch(e => console.log('getting downloadURL of image error => ', e))
      .finally(() => {
        setpriloading(false);
        setloding(false);
      });
  };

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

  const uploadfile = async uploaduri => {
    const filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1);
    const task = storagee().ref(filename).putFile(uploaduri);
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
      await geturl(filename);
    } catch (e) {
      console.error(e);
    }
  };

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
        ],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (
        fileUri.indexOf('.png') !== -1 ||
        fileUri.indexOf('.jpg') !== -1 ||
        fileUri.indexOf('.mp4') !== -1 ||
        fileUri.indexOf('.mov') !== -1
      ) {
        setImagePath(
          Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        );
        uploadfile(
          Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        );
        setIsAttachImage(true);
        setloding(true);
      } else if (fileUri.indexOf('.mp3') !== -1) {
        setFilePath(fileUri);
        setIsAttachFile(true);
        setloding(true);
        uploadfile(
          Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        );
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
        setloding(true);
        uploadfile(
          Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        );
      }
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
        <TouchableOpacity onPress={_pickDocument}>
          <Icon
            type="font-awesome"
            name="attach"
            style={styles.paperClip}
            size={28}
            color="grey"
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
                color="#009387"
              />
            </View>
          </Send>
        ) : null}
      </View>
    );
  };
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <ImageBackground
            source={{uri: imagePath}}
            style={{height: 75, width: 75, justifyContent: 'center'}}>
            {loding == true ? (
              <ActivityIndicator
                color={'white'}
                size={'small'}
                style={{alignSelf: 'center'}}
              />
            ) : null}
          </ImageBackground>
          <TouchableOpacity
            onPress={() => {
              setImagePath(''), setloding(false);
            }}
            style={styles.buttonFooterChatImg}>
            <View style={styles.textFooterChat}>
              <Text style={{color: '#009387', alignSelf: 'center'}}>X</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={filePath} />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            style={styles.buttonFooterChatImg}>
            <View style={styles.textFooterChat}>
              <Text style={{color: '#009387', alignSelf: 'center'}}>X</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath, loding]);

  const onSend = useCallback(
    (messages = []) => {
      const [messageToSend] = messages;

      if (isAttachImage) {
        const newMessage = {
          ...messageToSend,
          createdAt: Date.now(),
          sentBy: user.uid,
          sentTo: uid,
          image: imagePath.split('.').pop() == 'mp4' ? '' : uplodedimagerul,
          vedio: imagePath.split('.').pop() == 'mp4' ? uplodedimagerul : '',
          file: {
            url: '',
          },
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
        const docid =
          uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .set(
            {
              latestMessage: {
                ...newMessage,
                createdAt: firestore.FieldValue.serverTimestamp(),
              },
            },
            {merge: true},
          );

        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .collection('messages')
          .add({
            ...newMessage,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        setImagePath('');
        setIsAttachImage(false);
        sendNotification(
          newMessage.text,
          fcmTokenss,
          `New Message From ${username}`,
          from == 'group' ? uid : user.uid,
        ).then(result => {
          console.log('notification res ', result);
        });
        // }
      } else if (isAttachFile) {
        const newMessage = {
          ...messageToSend,
          createdAt: new Date(),
          sentBy: user.uid,
          sentTo: uid,
          image: '',
          vedio: imagePath.split('.').pop() == 'mp4' ? uplodedimagerul : '',
          file: {
            url:
              filePath.split('.').pop() == 'pdf' ||
              filePath.split('.').pop() == 'mp3'
                ? uplodedimagerul
                : '',
            type: filePath.split('.').pop(),
          },
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
        const docid =
          uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .set(
            {
              latestMessage: {
                ...newMessage,
                createdAt: firestore.FieldValue.serverTimestamp(),
              },
            },
            {merge: true},
          );
        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .collection('messages')
          .add({
            ...newMessage,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        setFilePath('');
        setIsAttachFile(false);
        sendNotification(
          newMessage.text,
          fcmTokenss,
          `New Message From ${username}`,
          from == 'group' ? uid : user.uid,
        ).then(result => {
          console.log('notification res ', result);
        });
      } else {
        const msg = messages[0];
        const usermsg = {
          ...msg,
          sentBy: user.uid,
          sentTo: uid,
          createdAt: Date.now(),
          image: '',
          file: {
            url: '',
          },
        };
        //  console.log('usermsg----->',usermsg)

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, usermsg),
        );
        const docid =
          uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .set(
            {
              latestMessage: {
                ...usermsg,
                createdAt: firestore.FieldValue.serverTimestamp(),
              },
            },
            {merge: true},
          );
        firestore()
          .collection(from == 'group' ? 'THREADS' : 'Chats')
          .doc(from == 'group' ? uid : docid)
          .collection('messages')
          .add({
            ...usermsg,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        // if (from !== 'group') {
        sendNotification(
          usermsg.text,
          fcmTokenss,
          `New Message From ${username}`,
          from == 'group' ? uid : user.uid,
        ).then(result => {
          console.log('notification res ', result);
        });
      }
    },
    [
      filePath,
      imagePath,
      isAttachFile,
      isAttachImage,
      uplodedimagerul,
      username,
    ],
  );

  const renderBubble = useCallback(
    props => {
      const {currentMessage} = props;
      if (
        (currentMessage.file && currentMessage.file.url) ||
        currentMessage.vedio
      ) {
        return (
          <TouchableOpacity
            style={{
              ...styles.fileContainer,
              backgroundColor:
                props.currentMessage.user._id === user.uid
                  ? '#009387'
                  : 'lightgrey',
              borderBottomLeftRadius:
                props.currentMessage.user._id === user.uid ? 15 : 5,
              borderBottomRightRadius:
                props.currentMessage.user._id === user.uid ? 5 : 15,
              right:
                props.currentMessage.user._id === user.uid
                  ? 0
                  : currentMessage.vedio
                  ? '35%'
                  : '35%',
            }}
            onPress={() => {
              setFileVisible(!fileVisible);
              setselecteditem(currentMessage);
            }}>
            <InChatFileTransfer
              style={{marginTop: -10}}
              filePath={
                currentMessage.vedio
                  ? currentMessage.vedio
                  : currentMessage.file.url
              }
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  ...styles.fileText,
                  color:
                    currentMessage.user._id === user.uid ? 'white' : 'black',
                }}>
                {currentMessage.text}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '96%',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  margin: 4,
                  fontSize: 12,
                  backgroundColor: 'transparent',
                  color: '#aaa',
                }}>
                ~ {currentMessage.user.name}
              </Text>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  margin: 4,
                  fontSize: 12,
                  backgroundColor: 'transparent',
                  color: '#aaa',
                }}>
                {dayjs(currentMessage.createdAt).locale('en').format('LT')}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }

      return (
        <Bubble
          {...props}
          renderUsernameOnMessage={from == 'group' ? true : false}
          wrapperStyle={{
            right: {
              backgroundColor: '#009387',
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

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        style={{flex: 1}}
        messages={messages}
        onSend={text => onSend(text)}
        renderChatFooter={renderChatFooter}
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
              containerStyle={{borderTopWidth: 1.5, borderTopColor: '#009387'}}
              textInputStyle={{color: 'black'}}
            />
          );
        }}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
      {fileVisible ? (
        <InChatViewFile
          props={selecteditem}
          visible={fileVisible}
          filee={selecteditem}
          onClose={() => setFileVisible(!fileVisible)}
        />
      ) : null}

      <AddUserc
        visible={showAddUser}
        props={user}
        groupId={uid}
        onClose={() => setshowAddUser(false)}
      />
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
    backgroundColor: '#009387',
    flexDirection: 'row',
    padding: 7,
  },
  textFooterChat: {
    backgroundColor: 'lightgrey',
    borderRadius: 40,
    color: 'white',
    width: 20,
    height: 20,
    justifyContent: 'center',
  },
});
