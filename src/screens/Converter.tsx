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

class Converter extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps , state: IState) {
        super(props, state);

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
                        value={this.state.value}
                        onPress={() => this.pressButton(this.props.navigation, 1)}
                    />
                    <InputWithButton buttonText={this.state.currency2} editable={false} onPress={() => this.pressButton(this.props.navigation, 2)}
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

    pressButton (navigate: any, index: number) {
        let buttonText;
        if ( index === 1 )
            buttonText = this.state.currency1;
        else buttonText = this.state.currency2;
        navigate('selectCurrency', {current: buttonText});
    }

    async componentWillMount() {
        try {
            fetch('https://api.fixer.io/latest')
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.rates) {
                        let key;
                        for (key in data.rates) {
                            this.state.currencies[key].rate = data.rates[key];
                        }
                        this.setState({
                            currencies: this.state.currencies, isLoading: false
                        });
                    } else {
                        throw 'Mattias';
                    }
                });
            await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
        } catch (error) {
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
        }
    }
}

export default Converter;
