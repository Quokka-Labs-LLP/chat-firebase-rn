/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {
  getLetestmsg,
  getunSeenmessgcount,
  timeFormatone,
} from '../helper/hepler';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@react-navigation/native';

const GetLetestMessage = ({userId, recId, from}) => {
  const {primary} = useTheme().colors;
  const docid = recId > userId ? userId + '-' + recId : recId + '-' + userId;
  const [message, setmessage] = useState('');
  const [msgtime, setmsgtime] = useState('');
  const [unseenCount, setanseencount] = useState([]);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      const letestMessage = getLetestmsg(QuerySnapshot);
      setmsgtime(timeFormatone(letestMessage?.createdAt));
      setmessage(
        letestMessage?.text
          ? letestMessage?.text
          : letestMessage?.image
          ? 'image'
          : letestMessage?.file?.url
          ? letestMessage?.file?.type
          : letestMessage?.location
          ? 'Location'
          : letestMessage?.contact
          ? 'Contact'
          : letestMessage?.vedio
          ? 'Video'
          : '',
      );
    }
    function onResultone(QuerySnapshot) {
      setanseencount(getunSeenmessgcount(QuerySnapshot, userId));
    }
    const unsubscribetwo = firestore()
      .collection(from == 'chat' ? 'Chats' : 'THREADS')
      .doc(from == 'chat' ? docid : recId)
      .collection('messages')
      .where('seenStatus', '!=', true)
      .onSnapshot(onResultone);
    const unsubscribe = firestore()
      .collection(from == 'chat' ? 'Chats' : 'THREADS')
      .doc(from == 'chat' ? docid : recId)
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
          color: 'black',
          paddingTop: 4,
          width: '80%',
          fontSize: 12,
        }}>
        {message}
      </Text>

      {unseenCount.length > 0 && (
        <View style={{marginTop: -20}}>
          <Text style={{color: primary, fontSize: 12, padding: 3}}>
            {msgtime}
          </Text>
          <View
            style={{
              color: 'white',
              backgroundColor: primary,
              borderRadius: 20,
              height: 20,
              width: 20,
              alignSelf: 'center',
            }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>
              {unseenCount.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
export default GetLetestMessage;
