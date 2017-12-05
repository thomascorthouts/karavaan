import React, {Component} from 'react';
import {View, Text, AsyncStorage, ActivityIndicator} from 'react-native';
import { InputWithButton } from '../components/TextInput/InputWithButton';
import { Data } from '../config/Data';

interface IState {
    currencies: Currencies;
    value: string;
    currency1: string;
    currency2: string;
    isLoading: boolean;
};

class Converter extends Component< {}, IState> {
    constructor(state: IState) {
        super(state);

        this.state = {
            currencies: {} as Currencies,
            value: '0',
            currency1: 'EUR',
            currency2: 'EUR',
            isLoading: true
        };
    }

    render() {

            if ( this.state.isLoading) {
                this.updateValuta(); 
                return <ActivityIndicator />;
            } else {
                return(
                <View>
                    <InputWithButton
                        buttonText={this.state.currency1}
                        selectCurrency={this.selectCurrency}
                        value={this.state.value}
                        onChangeText={(text: string) => {
                            this.setState({value: text});
                        }}
                    />
                    <InputWithButton buttonText={this.state.currency2} selectCurrency={this.selectCurrency} editable={false}
                                     value={this.convert( parseInt(this.state.value, 10), this.state.currency1, this.state.currency2).toString()}/>
                </View>
                ); }
    }

    selectCurrency = () => {

    }

    selectThisCurrency = (tag: string) => {
        return this.state.currencies.get(tag);
    }

    convert = (amount: number, from: string, to: string) => {
        return amount * this.getRate(from, to);
    }

    getRate = ( from: string, to: string) => {
        const currencies = this.state.currencies;
        console.log(currencies);
        const rateFrom = currencies[from].rate;
        const rateTo = currencies[to].rate;

        return rateTo / rateFrom;

    }

    componentWillMount() {

        AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    console.log('value' + value);
                    this.setState({
                        currencies: JSON.parse(value), isLoading: false
                    });
                } else {
                    this.setState({
                        currencies: Data.currencies
                    });
                    console.log(this.state.currencies);
                }
            });
    }

    async updateValuta() {
        try {
            fetch('https://api.fixer.io/latest')
                .then((resp) => resp.json())
                .then((data) => {
                    let key;
                    for (key in data.rates) {
                        console.log(key);
                        this.state.currencies[key].rate = data.rates[key];
                    }
                    console.log(this.state.currencies);
                })
            await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
        } catch (error) {
            console.log(error);
        }
    }
}

export default Converter;
