import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import MessageScreen from './screens/MessageScreen';
import GroupScreen from './screens/GroupScreen';
import About from './screens/About';
import UserAbout from './screens/UserAbout';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {NotificationController} from './screens/Notification/NotificationController';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#7961C1',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}>
  <Stack.Screen name="Chats" component={ChatScreen} />
  <Stack.Screen name="About" component={About} />
  <Stack.Screen name="UserAbout" component={UserAbout} />
</Stack.Navigator>;
const msgsName = 'Messages';
const profileName = 'Profile';
const GroupName = 'Group';

function TheTab({user, setvisiblee}) {
  return (
    <Tab.Navigator
      initialRouteName={msgsName}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;
          if (rn === msgsName) {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === profileName) {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: '#7961C1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#7961C1',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 10, fontWeight: '900'},
      })}>
      <Tab.Screen name="Messages">
        {props => <MessageScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Group" options={{headerShown: false}}>
        {props => (
          <Stack.Navigator>
            <Stack.Screen
              name="GroupScreen"
              component={GroupScreen}
              initialParams={{userid: user.uid}}
              options={{
                title: 'Group',
                headerStyle: {
                  backgroundColor: '#7961C1',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const userCheck = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser('');
      }
    });
    return () => {
      userCheck();
    };
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#7961C1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          {user ? (
            <>
              <Stack.Screen name="Home" options={{headerShown: false}}>
                {props => <TheTab {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen
                name="Chats"
                options={({route}) => ({
                  title: route.params.name,
                  headerBackTitleVisible: false,
                })}>
                {props => <ChatScreen {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen
                name="About"
                options={({route}) => ({
                  title: route.params.name,
                  headerBackTitleVisible: false,
                })}>
                {props => <About {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen
                name="UserAbout"
                options={({route}) => ({
                  title: route.params.name,
                  headerBackTitleVisible: false,
                })}>
                {props => <UserAbout {...props} user={user} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="Signin"
                component={SigninScreen}
                options={() => ({
                  headerBackVisible: false,
                  headerShown: false,
                })}
              />

              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={() => ({
                  headerBackVisible: false,
                  headerShown: false,
                })}
              />
            </>
          )}
        </Stack.Navigator>
        <NotificationController />
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  iconColor: {
    color: '009387',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#7961C1',
  },
  buttonLabel: {
    fontSize: 22,
    color: '#7961C1',
    alignSelf: 'center',
  },
  buttonStyle: {
    borderColor: '#7961C1',
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
    borderBottomColor: '#7961C1',
    color: 'black',
  },
});
