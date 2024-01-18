import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator, View} from 'react-native';
import {checkIfFileExists, downloadFileFromurl} from '../helper/useFileStystem';
const DownloadButton = ({filePath}) => {
  const [check, setcheck] = useState(false);
  const [lodingg, setloding] = useState(false);
  useEffect(() => {
    checkIfFileExists(filePath).then(res => {
      setcheck(res);
    });
  }, []);
  const handelDownload = async () => {
    setcheck(true);
    setloding(true);
    await downloadFileFromurl(filePath).then(res => {
      setloding(false);
    });
  };
  return (
    <View>
      {!check && !lodingg ? (
        <Icon
          name={'arrow-down-sharp'}
          onPress={() => handelDownload()}
          size={20}
          color={'grey'}
          style={{padding: 4}}
        />
      ) : lodingg ? (
        <ActivityIndicator size={'small'} color={'grey'} />
      ) : null}
    </View>
  );
};
export default DownloadButton;
