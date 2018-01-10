import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, KeyboardAvoidingView, Dimensions, NetInfo } from 'react-native';
import { _currencies } from '../config/Data';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../components/Pickers/CurrencyPicker';
import { GreenButton } from '../components/Buttons/GreenButton';
import DatePicker from 'react-native-datepicker';
import { NavigationActions } from 'react-navigation';
import { showError } from '../utils/popup';
import { parseMoney } from '../utils/parsemoney';
import { getRate } from '../utils/getRate';
import {standardStyles, specificStyles, backgroundColorStyles} from './screenStyles';

interface IState {
    currencies: Currencies;
    value: string;
    currency1: Currency;
    currency2: Currency;
    date: string;
    latest: string;
    isLoading: boolean;
}

class Converter extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            currencies: _currencies,
            value: '0',
            currency1: {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            } as Currency,
            currency2: {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            } as Currency,
            date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
            latest: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
            isLoading: true
        };
    }

    render() {
        const { dispatch } = this.props.navigation;

        let height = Dimensions.get('window').height;
        let width = Dimensions.get('window').width;

        if (this.state.isLoading) {
            return (
                <View style={ standardStyles.flexCenter }>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <View style={ [specificStyles.container, backgroundColorStyles.lightGreen] }>
                    <StatusBar hidden={true} />

                    <View style={ [standardStyles.flex, { paddingBottom: 80 }] }>
                        <Text style={ specificStyles.title }>Currency Converter</Text>
                    </View>

                    <KeyboardAvoidingView behavior={'padding'} style={{ height: height * 0.6 }}>
                        <View style={ standardStyles.rowContainer }>
                            <View style={ standardStyles.doubleFlex }>
                                <InputWithoutLabel
                                    onChangeText={(value: any) => this.setState({ value })}
                                    value={this.state.value}
                                    returnKeyType={'done'}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={ standardStyles.flex }>
                                <CurrencyPicker
                                    currencies={this.state.currencies}
                                    onValueChange={(currency1: any) => this.setState({ currency1 })}
                                    selectedValue={this.state.currency1}
                                />
                            </View>
                        </View>

                        <View style={ standardStyles.rowContainer }>
                            <View style={ standardStyles.doubleFlex }>
                                <InputWithoutLabel
                                    onChangeText={(value: string) => this.setState({ value })}
                                    value={this.convert(parseFloat(parseMoney(this.state.value)), this.state.currency1.tag, this.state.currency2.tag).toString()}
                                    editable={false}
                                />
                            </View>
                            <View style={ standardStyles.flex }>
                                <CurrencyPicker
                                    currencies={this.state.currencies}
                                    onValueChange={(currency2: Currency) => this.setState({ currency2 })}
                                    selectedValue={this.state.currency2}
                                />
                            </View>
                        </View>

                        <DatePicker
                            style={{ width: width - 40 }}
                            date={this.state.date}
                            mode='date'
                            placeholder='Select Date'
                            format='YYYY-MM-DD'
                            minDate='2000-01-01'
                            maxDate={this.state.date}
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date: string) => this.setState({ date })}
                        />
                    </KeyboardAvoidingView>

                    <View style={ standardStyles.rowContainer }>
                        <View style={ standardStyles.flex }>
                            <GreenButton buttonStyle={ specificStyles.leftButton } buttonText={'CLOSE'} onPress={() => dispatch(NavigationActions.navigate({ routeName: 'Home' }))} />
                        </View>
                        <View style={ standardStyles.flex }>
                            <GreenButton buttonStyle={ specificStyles.rightButton } buttonText={'SUBMIT DATE'} onPress={() => this.validate()} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    validate() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected && this.state.latest !== this.state.date.trim()) {
                this.setState({ isLoading: true }, () => this.getExchangeRate(this.state.date.trim()));
            } else if (!isConnected && this.state.latest) {
                showError('No internet connection available\n\nUsing exchange rates from ' + this.state.latest);
                this.setState({ date: this.state.latest });
            } else if (!isConnected) {
                showError('No internet connection available');
            }
        });
    }

    convert(amount: number, from: string, to: string) {
        let conversion = amount * getRate(from, to, this.state.currencies);
        return (isNaN(conversion)) ? 0 : conversion;
    }

    async getExchangeRate(date: string) {
        let currs = JSON.parse(JSON.stringify(_currencies));

        let headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };

        fetch('http://api.fixer.io/' + date, { method: 'GET', headers: headers, body: null })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.rates) {
                    let key;
                    for (key in data.rates) {
                        currs[key].rate = data.rates[key];
                    }
                    this.setState({
                        currencies: currs, isLoading: false
                    });
                } else {
                    throw 'Mathias';
                }
            })
            .catch((error) => {
                showError('Failed to fetch exchange rates\n\n' + error);
            });
    }

    async componentDidMount() {
        let currency = await AsyncStorage.getItem('defaultCurrency')
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                }
            });

        let currencies = await AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    showError('No exchange rate information available');
                }
            });

        if (currencies) {
            this.setState({
                currency1: currency, currency2: currency, currencies: currencies.rates, latest: currencies.latest, isLoading: false
            });
        }
    }
}

export default Converter;