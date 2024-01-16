import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {getLetestmsg, getunSeenmessgcount} from '../helper/hepler';
import firestore from '@react-native-firebase/firestore';

const GetLetestMessage = ({userId, recId}) => {
  const docid = recId > userId ? userId + '-' + recId : recId + '-' + userId;
  const [message, setmessage] = useState('');
  const [unseenCount, setanseencount] = useState([]);
  useEffect(() => {
    function onResult(QuerySnapshot) {
      const letestMessage = getLetestmsg(QuerySnapshot);
      setmessage(
        letestMessage?.text
          ? letestMessage?.text
          : letestMessage?.image
          ? 'image'
          : letestMessage?.file?.url
          ? 'Doc'
          : letestMessage?.location
          ? 'Location'
          : '',
      );
    }
    function onResultone(QuerySnapshot) {
      setanseencount(getunSeenmessgcount(QuerySnapshot, userId));
    }
    const unsubscribetwo = firestore()
      .collection('Chats')
      .doc(docid)
      .collection('messages')
      .where('seenStatus', '!=', true)
      .onSnapshot(onResultone);
    const unsubscribe = firestore()
      .collection('Chats')
      .doc(docid)
      .onSnapshot(onResult);
    return () => {
      unsubscribe;
      unsubscribetwo;
    };
  }, []);
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      }}>
      <Text
        numberOfLines={1}
        style={{
          color: unseenCount.length > 0 ? '#009387' : 'black',
          fontWeight: unseenCount.length > 0 ? 'bold' : '600',
          paddingTop: 4,
          width: '80%',
        }}>
        {message}
      </Text>
      {unseenCount.length > 0 && (
        <View
          style={{
            color: 'white',
            backgroundColor: '#009387',
            borderRadius: 20,
            height: 20,
            width: 20,
            alignSelf: 'center',
          }}>
          <Text style={{color: 'white', alignSelf: 'center'}}>
            {unseenCount.length}
          </Text>
        </View>
      )}
    </View>
  );
};
export default GetLetestMessage;
