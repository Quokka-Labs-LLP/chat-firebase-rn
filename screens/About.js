/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storagee from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import {sendNotification} from './Notification/NotificationController';
import {Button} from './Components/Button';
import {useTheme} from '@react-navigation/native';

const About = ({navigation, route, user}) => {
  const {groupitem} = route.params;
  const {colors} = useTheme();
  const [groupmembers, setgroupmembers] = useState([]);
  const [grupeImage, setgrupimage] = useState();
  const [lodingtwo, setlodingtwo] = useState(false);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      try {
        function onFcmResult(QuerySnapshot) {
          try {
            const fcmtokens = QuerySnapshot.docs.map(docSnap => docSnap.data());
            setgroupmembers(fcmtokens);
          } catch (error) {
            console.log('docSnap==', error);
          }
        }
        const groupdata = QuerySnapshot.data();
        setgrupimage(groupdata?.groupImage);
        firestore()
          .collection('users')
          .where('uid', 'in', groupdata.members)
          .onSnapshot(onFcmResult);
      } catch (error) {
        console.log('docSnap==', error);
      }
    }

    // Assuming userIDs is an array of user IDs you want to fetch
    const unsubscribe = firestore()
      .collection('THREADS')
      .doc(groupitem.threadId)
      .onSnapshot(onResult);

    return () => unsubscribe;
  }, [lodingtwo]);

  const removeMemberFromGroup = async item => {
    try {
      const groupRef = firestore()
        .collection('THREADS')
        .doc(groupitem.threadId);

      // Remove the specified member from the 'members' array
      await groupRef.update({
        members: firestore.FieldValue.arrayRemove(item.uid),
      });

      // Add a system message indicating the member removal
      await groupRef.collection('messages').add({
        _id: new Date(),
        text: 'admin removed a member from the group.',
        createdAt: new Date(),
        system: true,
      });

      // Notify the removed member
      sendNotification(
        'admin removed you from the group.',
        [item.fcmToken],
        'Group Removal',
        user.uid,
      );
      // navigation.goBack();
    } catch (error) {
      console.error('Error removing user from the group:', error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      // Reference to the group document
      const groupRef = firestore()
        .collection('THREADS')
        .doc(groupitem.threadId);

      // Delete the group document
      await groupRef.delete();

      // Navigate back or perform any other action after deletion
      navigation.navigate('Group');
    } catch (error) {
      console.error('Error deleting group:', error);
      // Handle the error, e.g., show an alert
      // Alert.alert('Error', 'Could not delete the group. Please try again.');
    }
  };
  const exitGroup = async () => {
    try {
      const groupRef = firestore()
        .collection('THREADS')
        .doc(groupitem.threadId);

      // Remove the specified member from the 'members' array
      groupitem.createdBy == user.uid
        ? await groupRef.update({
            createdBy: groupmembers[0].uid,
            members: firestore.FieldValue.arrayRemove(user.uid),
          })
        : await groupRef.update({
            members: firestore.FieldValue.arrayRemove(user.uid),
          });

      // Add a system message indicating the member removal
      await groupRef.collection('messages').add({
        _id: new Date(),
        text: '1 member exit from the group.',
        createdAt: new Date(),
        system: true,
      });
      navigation.navigate('Group');
    } catch (error) {
      console.error('Error removing user from the group:', error);
    }
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  const ListFooterComponent = () => {
    return (
      <View>
        <Button text={'Exit Group'} onPress={() => exitGroup()} />
        {groupitem.createdBy == user.uid && (
          <Button text={'Delete Group'} onPress={() => handleDeleteGroup()} />
        )}
      </View>
    );
  };
  const geturl = async filename => {
    let imageRef = storagee().ref('/' + filename);
    imageRef
      .getDownloadURL()
      .then(url => {
        firestore().collection('THREADS').doc(groupitem.threadId).update({
          groupImage: url,
        });
      })
      .catch(e => console.log('getting downloadURL of image error => ', e))
      .finally(() => {
        setlodingtwo(false);
      });
  };
  const uploadfile = async uploaduri => {
    setlodingtwo(true);
    const filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1);
    const task = storagee().ref(filename).putFile(uploaduri);
    try {
      await task;
      await geturl(filename);
    } catch (e) {
      console.error(e);
    }
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: false,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
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
  // eslint-disable-next-line react/no-unstable-nested-components
  const GroupMemberItem = ({item, groupitem, user, removeMemberFromGroup}) => {
    const renderProfilePic = () => {
      if (item.profilePic) {
        return (
          <Image
            style={styles.userImageST}
            resizeMode="cover"
            source={{uri: item.profilePic}}
          />
        );
      } else {
        return (
          <Icon
            style={{alignSelf: 'center'}}
            name={'person'}
            size={25}
            color={'white'}
          />
        );
      }
    };

    return (
      <View>
        <View style={styles.card}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={[styles.userImageST, {backgroundColor: colors.primary}]}>
              {renderProfilePic()}
            </View>
            <View style={styles.textArea}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.msgContent}>{item.email}</Text>
            </View>
          </View>
          {groupitem.createdBy === item.uid ? (
            <View style={styles.adminCon}>
              <Text
                style={[
                  styles.simpleText,
                  {paddingHorizontal: 3, color: 'white'},
                ]}>
                Admin
              </Text>
            </View>
          ) : (
            groupitem.createdBy === user.uid && (
              <TouchableOpacity onPress={() => removeMemberFromGroup(item)}>
                <Text style={[styles.removeText, {color: colors.primary}]}>
                  Remove
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.Contain}>
      <View style={[styles.userImageSTT, {backgroundColor: colors.primary}]}>
        {grupeImage ? (
          <Image
            style={styles.groupImage}
            resizeMode="cover"
            source={{uri: grupeImage}}
          />
        ) : (
          <Icon
            style={{alignSelf: 'center'}}
            name={'person'}
            size={55}
            color={'white'}
          />
        )}

        <View
          style={{
            position: 'absolute',
            bottom: -1,
            alignSelf: 'flex-end',
          }}>
          <Icon
            style={{alignSelf: 'center'}}
            name={'create'}
            size={25}
            color={colors.primary}
            onPress={() => pickImage()}
          />
        </View>
      </View>
      {lodingtwo && (
        <ActivityIndicator
          size={'small'}
          style={{alignSelf: 'center'}}
          color={colors.primary}
        />
      )}
      <View>
        <Text style={styles.simpleText}>{groupitem.name}</Text>
        <Text style={styles.simpleText}>
          {new Date(
            groupitem.grupecreatedAt.seconds * 1000 +
              Math.round(groupitem.grupecreatedAt.nanoseconds / 1e6),
          ).toLocaleString()}
        </Text>
      </View>

      <Text
        style={[
          styles.simpleText,
          {fontWeight: 'bold'},
        ]}>{`${groupmembers.length} members`}</Text>
      <FlatList
        data={groupmembers}
        style={{marginTop: 30, width: '100%'}}
        keyExtractor={item => item.uid}
        ListFooterComponent={ListFooterComponent}
        renderItem={({item}) => (
          <GroupMemberItem
            item={item}
            groupitem={groupitem}
            user={user}
            removeMemberFromGroup={removeMemberFromGroup}
          />
        )}
      />
    </View>
  );
};
export default About;

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
  card: {
    width: '90%',
    height: 'auto',
    marginHorizontal: 4,
    marginVertical: 6,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
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
  msgContent: {
    paddingTop: 5,
    color: 'black',
  },
  simpleText: {
    alignSelf: 'center',
    color: 'black',
    marginVertical: 2,
    fontSize: 16,
  },
  adminCon: {
    right: 50,
    alignSelf: 'center',
    backgroundColor: '#00bfa5',
    borderRadius: 10,
  },
  removeText: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    right: 55,
  },
});
