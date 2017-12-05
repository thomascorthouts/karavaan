import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import { InputWithButton } from '../components/TextInput/InputWithButton';
import { currencies } from '../config/Data';

interface IState {
    currencies: Currencies;
    value: string;
    currency1: string;
    currency2: string;
    isLoading: boolean;
};

class Converter extends Component<{}, IState> {
    constructor(state: IState) {
        super(state);

        this.state = {
            currencies: currencies,
            value: '0',
            currency1: 'EUR',
            currency2: 'EUR',
            isLoading: true
        };
    }

    render() {
        if (this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return (
                <View>
                    <InputWithButton
                        buttonText={this.state.currency1}
                        selectCurrency={this.selectCurrency}
                        value={this.state.value}
                        onChangeText={(text: string) => {
                            this.setState({ value: text });
                        }}
                    />
                    <InputWithButton buttonText={this.state.currency2} selectCurrency={this.selectCurrency} editable={false}
                        value={this.convert(parseInt(this.state.value, 10), this.state.currency1, this.state.currency2).toString()} />
                </View>
            );
        }
    }

    selectCurrency = () => { };

    selectThisCurrency = (tag: string) => {
        return this.state.currencies[tag];
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

    async componentWillMount() {
        try {
            fetch('https://api.fixer.io/latest')
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.rates) {
                        let key;
                        for (key in data.rates) {
                            console.log(key);
                            this.state.currencies[key].rate = data.rates[key];
                        }
                        this.setState({
                            currencies: this.state.currencies, isLoading: false
                        });
                    } else {
                        throw 'Thomas';
                    }
                });
            await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
            console.log('test');
        } catch (error) {
            AsyncStorage.getItem('currencies')
                .then((value) => {
                    if (value) {
                        console.log('value' + value);
                        this.setState({
                            currencies: JSON.parse(value), isLoading: false
                        });
                    } else {
                        this.setState({
                            currencies: currencies, isLoading: false
                        });
                    }
                });
        }
    }
}

export default Converter;
