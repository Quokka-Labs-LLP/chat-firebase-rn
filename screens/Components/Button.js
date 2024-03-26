import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

export const Button = ({text, onPress}) => {
  const {primary} = useTheme().colors;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonStyle, {borderColor: primary}]}>
      <Text style={[styles.textStyle, {color: primary}]}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    height: 50,
    width: '93%',
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
  },
  textStyle: {
    alignSelf: 'center',
  },
});
