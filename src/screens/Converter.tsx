import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';

interface IState {
    currencies: ICurrencies;
};

interface ICurrencies{
    [index: string]: number;

}

class Converter extends Component< {}, IState> {

    state = {
        currencies: {} as ICurrencies
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
        return amount * this.getRate(from, to);

    }

    getRate = ( from: string, to: string) => {
        const rateFrom = this.state.currencies[from];
        const rateTo = this.state.currencies[to];

        return rateTo / rateFrom;

    }

    fetchData = () => {
        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.state.currencies = data.rates);

    }
}

export default Converter;
