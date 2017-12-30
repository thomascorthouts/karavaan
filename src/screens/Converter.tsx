import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import { currencies } from '../config/Data';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../components/Pickers/CurrencyPicker';
import { GreenButton } from '../components/Buttons/GreenButton';
import { InputWithLabel } from '../components/TextInput/InputWithLabel';

interface IState {
    currencies: Currencies;
    value: string;
    currency1: Currency;
    currency2: Currency;
    date: string;
    isLoading: boolean;
};

class Converter extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            currencies: currencies,
            value: '20',
            currency1: currencies.EUR,
            currency2: currencies.EUR,
            date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDay()).slice(-2),
            isLoading: true
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        let height = Dimensions.get('window').height;

        if (this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return (
                <View style={styles.container}>
                    <StatusBar hidden={true} />

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Currency Converter</Text>
                    </View>

                    <KeyboardAvoidingView behavior={'padding'} style={{ height: height * 0.6 }}>
                        <View style={styles.rowContainer}>
                            <View style={styles.inputAmount}>
                                <InputWithoutLabel
                                    onChangeText={(value: any) => this.setState({ value })}
                                    value={this.state.value}
                                    returnKeyType={'done'}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={styles.flex}>
                                <CurrencyPicker
                                    currencies={this.state.currencies}
                                    onValueChange={(currency1: any) => this.setState({ currency1 })}
                                    selectedValue={this.state.currency1}
                                />
                            </View>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={styles.inputAmount}>
                                <InputWithoutLabel
                                    onChangeText={(value: string) => this.setState({ value })}
                                    value={this.convert(parseFloat(this.state.value), this.state.currency1.tag, this.state.currency2.tag).toString()}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.flex}>
                                <CurrencyPicker
                                    currencies={this.state.currencies}
                                    onValueChange={(currency2: Currency) => {
                                        console.log(currency2);
                                        this.setState({ currency2 }, () => console.log(this.state.currency2));
                                    }}
                                    selectedValue={this.state.currency2}
                                />
                            </View>
                        </View>

                        <InputWithLabel
                            labelText={'Date (yyyy-mm-dd)'}
                            value={this.state.date}
                            placeholder={'yyyy-mm-dd'}
                            onChangeText={(date: string) => this.setState({ date })}
                            onSubmitEditing={() => this.validate()}
                        />
                    </KeyboardAvoidingView>

                    <View style={styles.rowContainer}>
                        <View style={styles.flex}>
                            <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                        </View>
                        <View style={styles.flex}>
                            <GreenButton buttonStyle={{ marginLeft: 2 }} buttonText={'SUBMIT DATE'} onPress={() => this.validate()} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    validate = () => {
        if ((!isNaN(Date.parse(this.state.date))) && this.state.date.split('-').length === 3) {
            this.setState({isLoading: true}, () => this.getExchangeRate(this.state.date.trim()));
        }
    }

    convert = (amount: number, from: string, to: string) => {
        return amount * this.getRate(from, to);
    }

    getRate = (from: string, to: string) => {
        const currencies = this.state.currencies;
        const rateFrom = currencies[from].rate;
        const rateTo = currencies[to].rate;

        return rateTo / rateFrom;
    }

    async getExchangeRate(date: string) {
        let currs = Object.assign({}, currencies);
        fetch('https://api.fixer.io/' + date)
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                if (data.rates) {
                    let key;
                    for (key in data.rates) {
                        console.log(key);
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
                console.log(error);
                this.showError('Failed to fetch exchange rates, using last saved rates');
                AsyncStorage.getItem('currencies')
                    .then((value) => {
                        if (value) {
                            this.setState({
                                currencies: JSON.parse(value), isLoading: false
                            });
                        } else {
                            this.setState({
                                currencies: currencies, isLoading: false
                            });
                        }
                    });
            });
        await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
    }

    showError(error: string) {
        Alert.alert('Warning', error.replace(/^[\n\r]+/, '').trim(),
            [
                { text: 'OK', onPress: () => { return false; } }
            ],
            { onDismiss: () => undefined }
        );
        return true;
    }

    async componentWillMount() {
        this.getExchangeRate('latest');
    }
}

export default Converter;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
    },
    titleContainer: {
        flex: 1,
        paddingBottom: 80
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputAmount: {
        flex: 3.6
    }
});