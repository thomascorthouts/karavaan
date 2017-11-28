import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';

interface IState {
    currencies: ICurrencies;
};

interface ICurrencies{

    'AUD': number;
    'BGN': number;
    'BRL': number;
    'CAD': number;
    'CHF': number;
    'CNY': number;
    'CZK': number;
    'DKK': number;
    'GBP': number;
    'HKD': number;
    'HRK': number;
    'HUF': number;
    'IDR': number;
    'ILS': number;
    'INR': number;
    'JPY': number;
    'KRW': number;
    'MXN': number;
    'MYR': number;
    'NOK': number;
    'NZD': number;
    'PHP': number;
    'PLN': number;
    'RON': number;
    'RUB': number;
    'SEK': number;
    'SGD': number;
    'THB': number;
    'TRY': number;
    'USD': number;
    'ZAR': number;
}

class Converter extends Component< {}, IState> {

    state = {
        currencies: {} as IState
    };

    constructor(state: IState) {
        super(state);
    }

    render() {
        return (
            <ScrollView>
                <Text>{this.convert(50, 'EUR', 'USD')}</Text>
            </ScrollView>
        );
    }

    convert = (amount: number, from: string, to: string) => {
        return amount * this.getRate(this.state.currencies, from, to);

    }

    getRate = (currencies: { [index: string ]: number }, from: string, to: string) => {
        const rateFrom = currencies[from];
        const rateTo = currencies[to];

        return rateTo / rateFrom;

    }

    fetchData = () => {
        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.currencies = data.rates);

    }
}

export default Converter;
