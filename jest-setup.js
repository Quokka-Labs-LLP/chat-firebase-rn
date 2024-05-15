import {create} from 'react-test-renderer';

jest.mock('@react-navigation/native-stack', () => ({
  useTheme: jest.fn().mockReturnValue({colors: {primary: 'red'}}),
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  }),
}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('@react-native-firebase/auth', () => 'auth');
jest.mock('react-native-svg', () => 'Svg');
jest.mock('@react-native-firebase/firestore', () => ({
  default: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        onSnapshot: jest.fn(),
      }),
    }),
  }),
}));
jest.mock('@react-native-firebase/storage', () => 'storagee');
jest.mock('react-native-document-picker', () => 'DocumentPicker');
jest.mock('@react-native-firebase/messaging', () => ({
  default: jest.fn().mockReturnValue({
    requestPermission: jest.fn(),
  }),
}));
jest.mock('@notifee/react-native', () => 'notifee');
jest.mock('react-native-image-picker', () => 'launchCamera');
jest.mock('react-native-gifted-chat', () => 'GiftedChat');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('react-native-sound-player', () => 'SoundPlayer');
jest.mock('react-native-pdf', () => 'Pdf');
jest.mock('react-native-geolocation-service', () => 'Geolocation');
jest.mock('expo-av', () => 'Video');
jest.mock('rn-fetch-blob', () => ({
  fs: {
    dirs: {
      // Define whatever properties you need for testing
      // For example, you can mock 'DocumentDir' as a string
      DocumentDir: '/mock/document/dir/path',
    },
  },
}));

// Other Mock Functions
