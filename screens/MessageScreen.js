/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-virtualized-view';
import firestore from '@react-native-firebase/firestore';
import {getUsers, capitalizeFirstLetter} from './helper/hepler';
import GetLetestMessage from './Components/GetLetestMessage';
import {useTheme} from '@react-navigation/native';

// Icon.loadFont().then();

const MessageScreen = ({user, navigation}) => {
  const {colors} = useTheme();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    function onResultt(QuerySnapshot) {
      setUsers(getUsers(QuerySnapshot));
    }
    const unsubscribe = firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .onSnapshot(onResultt);
    return () => unsubscribe;
  }, []);
  const UserListItem = ({item, user, navigation}) => {
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
            // eslint-disable-next-line react-native/no-inline-styles
            style={{alignSelf: 'center'}}
            name={'person'}
            size={25}
            color={'white'}
          />
        );
      }
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chats', {
            name: item.name,
            uid: item.uid,
            from: 'messages',
            fcmToken: item.fcmToken,
            item: item,
          })
        }>
        <View style={styles.card}>
          <View style={[styles.userImageST, {backgroundColor: colors.primary}]}>
            {renderProfilePic()}
          </View>
          <View style={styles.textArea}>
            <Text style={styles.nameText}>
              {capitalizeFirstLetter(item.name)}
            </Text>
            <GetLetestMessage
              userId={user.uid}
              recId={item.uid}
              from={'chat'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // useEffect(async () => {
  //   const chatHistory = new FirestoreChatMessageHistory({
  //     collectionName: "langchain",
  //     sessionId: "lc-example",
  //     userId: "a@example.com",
  //     config: {projectId: 'your-project-id'},
  //   });

  //   const chain = new ConversationChain({
  //     llm: new ChatOpenAI(),
  //     memory: new BufferMemory({chatHistory}),
  //   });

  //   const response = await chain.invoke({
  //     input: 'What did I just say my name was?',
  //   });
  //   console.log({response});
  // },[]);
  console.log('llll', user);
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={styles.Contain}>
          <FlatList
            data={users}
            keyExtractor={item => item.uid}
            renderItem={({item}) => (
              <UserListItem item={item} user={user} navigation={navigation} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Contain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 4,
    marginVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Verdana',
    color: 'black',
  },
});

export default MessageScreen;
