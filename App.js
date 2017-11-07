import React, { Component } from 'react';
import { AppRegistry, BackHandler, Alert } from 'react-native';
import Root from './build/src/config/Router';

export default class App extends Component {
  render() {
    return <Root />;
  }

  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // }

  handleBackButton() {
    Alert.alert('Warning', 'Do you really want to close the application?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => BackHandler.exitApp() }
      ],
      { onDismiss: () => undefined }
    );
    return true;
  }
}

AppRegistry.registerComponent('Karavaan', () => App);