import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {getAllGroups, sortGrups, capitalizeFirstLetter} from './helper/hepler';
import GetLetestMessage from './Components/GetLetestMessage';
const GroupScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const [groups, setgroups] = useState(null);
  const [visible, setvisible] = useState(false);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    function onResult(QuerySnapshot) {
      getAllGroups(QuerySnapshot).then(res => {
        sortGrups(res).then(ress => {
          setgroups(ress);
        });
      });
    }
    const unsubscribe = firestore()
      .collection('THREADS')
      .where('members', 'array-contains', route.params.userid)
      .onSnapshot(onResult);
    return () => unsubscribe;
  }, []);
  const createRoom = () => {
    if (channelName.length > 0) {
      const createGroupAndAddUser = async (channelName, userId) => {
        try {
          // Create a group
          const groupRef = await firestore()
            .collection('THREADS')
            .add({
              name: channelName,
              latestMessage: {
                text: `You have joined the room ${channelName}.`,
                createdAt: new Date(),
              },
              members: [userId],
              grupecreatedAt: new Date(),
              createdBy: userId,
            });

          const groupId = groupRef.id;
          // Add a system message to the group
          await groupRef.collection('messages').add({
            _id: new Date(),
            text: `You have joined the ${channelName}.`,
            createdAt: new Date(),
            system: true,
          });
          return groupId;
        } catch (error) {
          console.error('Error creating group and adding user:', error);
          return null;
        }
      };
      createGroupAndAddUser(channelName, route.params.userid);
      setChannelName('');
      setvisible(!visible);
    }
  };
  return (
    <View style={styles.Contain}>
      <SafeAreaView>
        <StatusBar />
        <View style={styles.Contain}>
          <FlatList
            data={groups}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={item => item.name}
            ListEmptyComponent={
              <Text style={{color: 'black'}}>No Group Available</Text>
            }
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Chats', {
                    name: item.name,
                    uid: item.threadId,
                    fcmToken: item.members,
                    from: 'group',
                    item: item,
                  })
                }>
                <View style={styles.card}>
                  <View
                    style={[
                      styles.userImageST,
                      {backgroundColor: colors.primary},
                    ]}>
                    {item.groupImage ? (
                      <Image
                        style={[
                          styles.userImageST,
                          {backgroundColor: colors.primary},
                        ]}
                        resizeMode="cover"
                        source={{uri: item.groupImage}}
                      />
                    ) : (
                      <Icon
                        style={{alignSelf: 'center'}}
                        name={'person'}
                        size={25}
                        color={'white'}
                      />
                    )}
                  </View>
                  <View style={styles.textArea}>
                    <Text style={styles.nameText}>
                      {capitalizeFirstLetter(item.name)}
                    </Text>

                    <GetLetestMessage
                      userId={route.params.userid}
                      recId={item.threadId}
                      from={'group'}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        onPress={() => setvisible(!visible)}
        style={{
          backgroundColor: colors.primary,
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: 20,
          alignSelf: 'flex-end',
          right: 30,
          borderRadius: 40,
          justifyContent: 'center',
        }}>
        <Icon
          name="add"
          size={25}
          color="white"
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
      <Modal
        visible={visible}
        onRequestClose={() => setvisible(!visible)}
        transparent={true}
        animationType="slide"
        style={{height: 400}}>
        <View
          style={{
            height: '80%',
            width: '97%',
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <Icon
            name="close-circle-outline"
            color={colors.primary}
            size={30}
            onPress={() => setvisible(!visible)}
            style={{alignSelf: 'flex-end', padding: 10}}
          />
          <View style={styles.innerContainer}>
            <Text style={[styles.title, {color: colors.primary}]}>
              Create a new Group
            </Text>
            <TextInput
              placeholder="Group Name"
              placeholderTextColor={'black'}
              maxLength={12}
              value={channelName}
              onChangeText={text => setChannelName(text)}
              clearButtonMode="while-editing"
              style={[styles.inputStyle, {borderBottomColor: colors.primary}]}
            />
            <TouchableOpacity
              style={[styles.buttonStyle, {borderColor: colors.primary}]}
              onPress={() => createRoom()}
              disabled={channelName.length === 0}>
              <Text style={[styles.buttonLabel, {color: colors.primary}]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupScreen;
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
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '10%',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
    alignSelf: 'center',
  },
  buttonStyle: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    borderWidth: 1,
  },
  inputStyle: {
    height: 54,
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    color: 'black',
  },
});
