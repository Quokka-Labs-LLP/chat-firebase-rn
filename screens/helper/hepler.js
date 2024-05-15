import dayjs from 'dayjs';
import firestore from '@react-native-firebase/firestore';
import storagee from '@react-native-firebase/storage';
import {storage} from '../Notification/NotificationController';
import RNFetchBlob from 'rn-fetch-blob';
let dirs = RNFetchBlob.fs.dirs;

const db = firestore();

// get all users
export const getUsers = QuerySnapshot => {
  try {
    return QuerySnapshot.docs.map(docSnap => docSnap.data());
  } catch (error) {
    console.log('docSanp==', error);
  }
};
// get all added and created grups for user
export const getAllGroups = async QuerySnapshot => {
  try {
    return QuerySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const threadId = docSnap.id;
      return {...data, threadId};
    });
  } catch (error) {
    console.log('docSanp==', error);
  }
};
//get fcm tokens
export const getFcmTokens = QuerySnapshot => {
  try {
    const fcmtokens = QuerySnapshot.docs
      .filter(
        docSnap => docSnap.data().fcmToken !== storage.getString('fcmtoken'),
      )
      .map(docSnap => docSnap.data().fcmToken);
    return fcmtokens;
  } catch (error) {
    console.log('docSnap==', error);
  }
};
// get messages
export const getMessages = QuerySnapshot => {
  try {
    const allTheMsgs = QuerySnapshot.docs.map(docSanp => {
      return {
        ...docSanp.data(),
        createdAt: docSanp.data()?.createdAt?.toDate(),
      };
    });
    // console.log('allTheMsgs', allTheMsgs);
    return allTheMsgs;
  } catch (error) {
    console.log('docSanp==', error);
  }
};
// get letest messase for on-one message

export const getLetestmsg = QuerySnapshot => {
  return QuerySnapshot.data()?.latestMessage;
};
export const sortGrups = async dataArray => {
  const extractTimestamp = createdAtObject => {
    // Convert Firestore timestamp object to milliseconds
    return createdAtObject?.seconds * 1000 + createdAtObject?.nanoseconds / 1e6;
  };

  const sortedArray = dataArray.sort((a, b) => {
    const timestampA = extractTimestamp(a.latestMessage?.createdAt);
    const timestampB = extractTimestamp(b.latestMessage?.createdAt);

    // Sorting in descending order, adjust accordingly if you want ascending order
    return timestampB - timestampA;
  });
  return sortedArray;
  // console.log('sortedArraysortedArray  ', JSON.stringify(sortedArray));
};
export const getunSeenmessgcount = (QuerySnapshot, userId) => {
  try {
    return QuerySnapshot.docs
      .filter(docSnap => docSnap.data().sentBy !== userId)
      .map(docSnap => docSnap.data());
  } catch (error) {
    console.log('docSanp==', error);
  }
};

// update letest message on firestore
export const updateLetestMessage = (from, uid, docid, newMessage) => {
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
};
export const updateMessages = (from, uid, docid, newMessage) => {
  firestore()
    .collection(from == 'group' ? 'THREADS' : 'Chats')
    .doc(from == 'group' ? uid : docid)
    .collection('messages')
    .add({
      ...newMessage,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateseenstatusgroup = async (chatID, userid) => {
  const db = firestore();
  const chatsCollection = db.collection('THREADS');
  chatsCollection
    .doc(chatID)
    .collection('messages')
    .where('sentBy', '!=', userid)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size > 0) {
        const batch = db.batch();
        querySnapshot.forEach(doc => {
          const messageRef = chatsCollection
            .doc(chatID)
            .collection('messages')
            .doc(doc.id);
          batch.update(messageRef, {seenStatus: true});
        });

        // Commit the batch update
        return batch.commit();
      } else {
      }
    })
    .catch(error => {
      console.error('Error updating messages:', error);
    });
};

export const updateSeenStatus = async (chatID, userid) => {
  const db = firestore();
  const chatsCollection = db.collection('Chats');
  chatsCollection
    .doc(chatID)
    .collection('messages')
    .where('sentTo', '==', userid)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size > 0) {
        const batch = db.batch();
        querySnapshot.forEach(doc => {
          const messageRef = chatsCollection
            .doc(chatID)
            .collection('messages')
            .doc(doc.id);
          batch.update(messageRef, {seenStatus: true});
        });

        // Commit the batch update
        return batch.commit();
      } else {
        console.log('querySnapshot.length', querySnapshot.size);
      }
    })
    .catch(error => {
      console.error('Error updating messages:', error);
    });
};

export const fileUploadd = async uploaduri => {
  const filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1);
  const task = storagee().ref(filename).putFile(uploaduri);
  task.on('state_changed', snapshot => {
    console.log(
      Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
    );
  });
  try {
    await task;
  } catch (e) {
    console.error(e);
  }
};

export const getUrl = async uploaduri => {
  const filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1);
  let imageRef = storagee().ref('/' + filename);
  return imageRef
    .getDownloadURL()
    .then(url => {
      return url;
    })
    .catch(e => console.log('getting downloadURL of image error => ', e));
};

export const getUserName = async userid => {
  const querySanp = await firestore()
    .collection('users')
    .where('uid', '==', userid)
    .get();
  const allUsers = querySanp.docs.map(docSnap => docSnap.data());
  return allUsers[0];
};

export const timeFormatone = timestamp => {
  if (timestamp?.seconds) {
    const milliseconds =
      timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1e6;
    const date = new Date(milliseconds);
    return dayjs(date).locale('en').format('HH:mm');
  } else {
    return dayjs(timestamp).locale('en').format('LT');
  }
};

export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const timeFormat = dateString => {
  return dayjs(dateString).locale('en').format('LT');
};
