import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';

class Converter extends Component {
    currencies: { [index: string]: number } = {
        'AUD': 1.5503,
        'BGN': 1.9558,
        'BRL': 3.8288,
        'CAD': 1.4969,
        'CHF': 1.1609,
        'CNY': 7.7755,
        'CZK': 25.469,
        'DKK': 7.442,
        'EUR': 1,
        'GBP': 0.8881,
        'HKD': 9.1775,
        'HRK': 7.577,
        'HUF': 313.54,
        'IDR': 15880.0,
        'ILS': 4.1392,
        'INR': 76.251,
        'JPY': 131.61,
        'KRW': 1280.2,
        'MXN': 22.098,
        'MYR': 4.8292,
        'NOK': 9.6723,
        'NZD': 1.7183,
        'PHP': 59.499,
        'PLN': 4.2155,
        'RON': 4.6525,
        'RUB': 68.948,
        'SEK': 9.8818,
        'SGD': 1.5885,
        'THB': 38.466,
        'TRY': 4.6557,
        'USD': 1.1749,
        'ZAR': 16.309
    };

    render() {
        return (
            <ScrollView>
                <Text>{this.convert(50, 'EUR', 'USD')}</Text>
            </ScrollView>
        );
    }

    convert = (amount: number, from: string, to: string) => {
        return amount * this.getRate(this.currencies, from, to);

    }

    getRate = (currencies: { [index: string ]: number }, from: string, to: string) => {
        const rateFrom = currencies[from];
        const rateTo = currencies[to];

        return rateTo / rateFrom;

    }

    fetchData = (currencies: { [index: string ]: number }, callback: Function) => {
        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => currencies = data.rates)
            .then(callback(currencies));

    }
}

export default Converter;
