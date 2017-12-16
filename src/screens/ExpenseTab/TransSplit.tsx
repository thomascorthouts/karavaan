import React, { Component } from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {currencies} from '../../config/Data';

interface IProps {

    navigation: any;
    group: Group;

};

interface IState {

    currency: string;
    currencies: Currencies;
    amount: string;
    recipient: string;
    receiver: string;

};

class TransSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            currency:  this.props.navigation.state.params.currency,
            currencies:  currencies,
            amount:  this.props.navigation.state.params.amount,
            recipient: '',
            receiver: ''
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <InputWithLabel labelText={'Recipient'} onChangeText={(recipient: any) => this.setState({recipient})}/>
                <InputWithCurrencySelector currentCurrency={ this.state.currency } currencies={this.state.currencies}
                                           value={ this.state.amount } onChangeText={(amount: any) => this.setState({amount})}
                                           onValueChange={(currency: any) => { this.setState({currency}); }} selectedValue= { this.state.currency }/>
                <InputWithLabel labelText={'Receiver'} onChangeText={(receiver: any) => this.setState({receiver})}/>
                <Button title={'Add Transaction'} onPress={() => this.addTransaction()}/>
            </View>
        );
    }

    addTransaction () {
        const amount = parseFloat(this.state.amount);
        // TODO
    }

    async componentWillMount() {

        AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    this.setState({
                        currencies: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        currencies: currencies
                    });
                }
            });
    }

}

export default TransSplit;
