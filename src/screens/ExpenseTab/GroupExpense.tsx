import React, { Component } from 'react';
import { View, Picker} from 'react-native';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {currencies} from '../../config/Data';

interface IState {
    currency: string;
    currencies: Currencies;
    amount: string;
    splitMode: string;
}

class GroupExpense extends Component<{}, IState> {

    constructor(state: IState) {
        super(state);

        this.state = {
            currency: 'EUR',
            currencies: currencies,
            amount: '0',
            splitMode: 'trans'
        };
    }

    render() {
            return (
                <View>
                    <InputWithLabel labelText={'description'}/>
                    <InputWithCurrencySelector currentCurrency={ this.state.currency } currencies={this.state.currencies}
                                               value={ this.state.amount }
                                               onValueChange={(currency: any) => { this.setState({currency}); }} selectedValue= { this.state.currency }/>
                    <Picker selectedValue={this.state.splitMode} onValueChange={(splitMode: any) => this.setState({splitMode})}>
                        <Picker.Item label={'Transaction'} value={'trans'} key={'trans'}/>
                        <Picker.Item label={'Split evenly'} value={'even'} key={'even'}/>
                        <Picker.Item label={'Bill Splitter'} value={'bill'} key={'bill'}/>
                        <Picker.Item label={'Exact amounts'} value={'amounts'} key={'amounts'}/>
                    </Picker>
                    </View>
            );
    }
}

export default GroupExpense;
