import React, {useState, useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
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
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {NotificationController} from './screens/Notification/NotificationController';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7961C1',
  },
};
<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: MyTheme.colors.primary,
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

function TheTab({user}) {
  return (
    <Tab.Navigator
      initialRouteName={msgsName}
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
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
          backgroundColor: MyTheme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: MyTheme.colors.primary,
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
                  backgroundColor: MyTheme.colors.primary,
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
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: MyTheme.colors.primary,
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
