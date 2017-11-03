import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from './build/src/components/LoginScreen';
import { HomeScreen } from './build/src/components/HomeScreen';
import { StackNavigator } from 'react-navigation';

const RootNavigator = StackNavigator({
  Login: {
      screen: LoginScreen,
  },
  Home: {
      screen: HomeScreen,
  }
},
{
  headerMode: 'none'
});

export default RootNavigator;