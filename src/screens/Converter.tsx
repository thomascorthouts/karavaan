import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native';
import { InputWithCurrencySelector } from '../components/TextInput/InputWithCurrencySelector';
import { currencies } from '../config/Data';

interface IState {
    currencies: Currencies;
    value: string;
    currency1: string;
    currency2: string;
    isLoading: boolean;
};

class Converter extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps , state: IState) {
        super(props, state);

        this.state = {
            currencies: currencies,
            value: '20',
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
                <View style={{justifyContent: 'center'}}>
                    <StatusBar hidden={true}/>
                    <InputWithCurrencySelector
                        selectedValue={this.state.currency1}
                        currentCurrency={this.state.currency1} currencies={this.state.currencies}
                        onChangeText={(value: any) => this.setState({value})}
                        onValueChange={(currency1: any) => this.setState({currency1})}
                        returnKeyType={'done'}
                    />
                    <InputWithCurrencySelector
                        selectedValue={this.state.currency2}
                        editable={false} currentCurrency={this.state.currency2} currencies={this.state.currencies}
                                               onValueChange={(currency2: any) => this.setState({currency2})}
                        returnKeyType={'done'}
                        value={this.convert(parseFloat(this.state.value), this.state.currency1, this.state.currency2).toString()} />
                </View>
            );
        }
    }

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
            let currs = this.state.currencies;
            fetch('https://api.fixer.io/latest')
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
                        throw 'Mattias';
                    }
                })
                .catch(() => {
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
}

export default Converter;
