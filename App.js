import Expo from 'expo';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { AppRegistry, NetInfo, Alert, KeyboardAvoidingView, View, AsyncStorage, BackHandler } from 'react-native';
import { _currencies } from './build/src/config/Data';
import Root from './build/src/config/Router';

export default class App extends Component {
    constructor(props, state) {
        super(props, state);

        this.state = {
            currentScreen: 'Login'
        }
    }

    render() {
        return (
            <Root
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = this.getCurrentRouteName(currentState);
                    const prevScreen = this.getCurrentRouteName(prevState);

                    if (prevScreen !== currentScreen) {
                        this.setState({ currentScreen });
                    }
                }}
                ref={nav => { this.navigator = nav; }}
            />
        );
    }

    componentDidMount() {
        // console.disableYellowBox = true;
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];

        // dive into nested navigators
        if (route.routes) {
            return this.getCurrentRouteName(route);
        }
        return route.routeName;
    }

    onBackPress = () => {
        if (this.state.currentScreen === 'Converter' || this.state.currentScreen === 'Settings') {
            this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }));
            return true;
        }

        if (this.state.currentScreen === 'Login' || this.state.currentScreen === 'ExpenseFeed' || this.state.currentScreen === 'GroupFeed') {
            Alert.alert('Warning', 'Do you really want to close the application?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => BackHandler.exitApp() }
            ],
                { onDismiss: () => undefined }
            );
            return true;
        }

        this.navigator.dispatch(NavigationActions.back());
        return true;
    }

    handleConnectivityChange = (isConnected) => {
        console.log('You are ' + (isConnected ? 'online' : 'offline'));
        if (isConnected) {
            AsyncStorage.getItem('currencies')
                .then((value) => {
                    let currencies, latest;
                    if (value) {
                        let parsed = JSON.parse(value);
                        currencies = parsed.currencies;
                        latest = parsed.latest;
                    }

                    let date = new Date();
                    let today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                    if (latest && latest === today) {
                        console.log('currencies up to date');
                        return;
                    }

                    this.updateExchangeRates('EUR', today);

                    AsyncStorage.getItem('defaultCurrency').then((value) => {
                        if (!value) {
                            AsyncStorage.setItem('defaultCurrency', JSON.stringify({ name: 'Euro', tag: 'EUR', rate: 1, symbol: '€' }));
                        }
                    });
                });

        }
    }

    async updateExchangeRates(base, today) {
        console.log('updating currencies');
        let headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };

        fetch('http://api.fixer.io/latest', { method: 'GET', headers: headers, body: null })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.rates) {
                    let key;
                    for (key in data.rates) {
                        _currencies[key].rate = data.rates[key];
                        _currencies[key].base = base;
                        _currencies[key].date = today;
                    }
                    _currencies[base].rate = 1;
                    _currencies[base].base = base;
                    _currencies[base].date = today;
                    let result = {
                        latest: today,
                        rates: _currencies
                    };
                    AsyncStorage.setItem('currencies', JSON.stringify(result));
                } else {
                    throw 'Mathias';
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

AppRegistry.registerComponent('Karavaan', () => App);