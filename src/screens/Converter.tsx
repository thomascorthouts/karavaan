import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { InputWithButton } from '../components/TextInput/InputWithButton';

interface IState {
    currencies: Currencies;
};



class Converter extends Component< {}, IState> {
    constructor(state: IState) {
        super(state);

        this.state = {
            currencies: {} as Currencies
        };
    }

    render() {
        return (
            <View>
                <InputWithButton buttonText={'EUR'} selectCurrency={this.selectCurrency}/>
                <InputWithButton buttonText={'EUR'} selectCurrency={this.selectCurrency} editable={false} value={this.convert(50, 'EUR', 'USD').toString()}/>
            </View>
        );
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
        const rateFrom = currencies[from].rate;
        const rateTo = currencies[to].rate;

        return rateTo / rateFrom;

    }

    fetchData = () => {
        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.setState({currencies: data.rates}));

    }
}

export default Converter;
