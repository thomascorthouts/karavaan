import Expo from 'expo';
import React, { Component } from 'react';
import { AppRegistry, NetInfo, Alert, KeyboardAvoidingView, View, AsyncStorage } from 'react-native';
import { currencies } from './build/src/config/Data';
import Root from './build/src/config/Router';

export default class App extends Component {
    render() {
        return (
            <Root />
        );
    }

    componentDidMount() {
        // console.disableYellowBox = true;
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
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

                    AsyncStorage.getItem('defaultCurrency').then((value) => {
                        let date = new Date();
                        let today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                        if (latest && latest === today) {
                            console.log('currencies up to date');
                            return
                        }

                        if (value) {
                            this.updateExchangeRates('?base=' + JSON.parse(value).tag, JSON.parse(value).tag, today);
                        } else {
                            this.updateExchangeRates('', 'EUR', today);
                            AsyncStorage.setItem('defaultCurrency', JSON.stringify({ name: 'Euro', tag: 'EUR', rate: 1, symbol: '€' }));
                        }
                    });
                });

        }
    }

    async updateExchangeRates(url, base, today) {
        console.log('updating currencies');
        fetch('https://api.fixer.io/latest' + url)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.rates) {
                    let key;
                    for (key in data.rates) {
                        currencies[key].rate = data.rates[key];
                        currencies[key].base = base;
                        currencies[key].date = today;
                    }
                    currencies[base].rate = 1;
                    currencies[base].base = base;
                    currencies[base].date = today;
                    let result = {
                        latest: today,
                        rates: currencies
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