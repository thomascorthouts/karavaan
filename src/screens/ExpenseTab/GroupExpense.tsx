import React, { Component } from 'react';
import { View, Picker, Button} from 'react-native';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {currencies} from '../../config/Data';

interface IState {
    group: Group;
    currency: string;
    currencies: Currencies;
    amount: string;
    splitMode: string;
}

class GroupExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group,
            currency: 'EUR',
            currencies: currencies,
            amount: '0',
            splitMode: 'trans'
        };
    }

    render() {
            const {navigate} = this.props.navigation;
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
                    <Button title={'NEXT'} onPress={() => this.nextScreen(navigate)}}/>
                    </View>
            );
    }

    nextScreen = (navigate: any) => {


        if(this.state.splitMode === 'bill') {
           // navigate('billSplit', );
        } else if (this.state.splitMode === 'trans') {
           // navigate('transSplit', );
        } else {
            navigate('amountSplit', {group:  this.state.group , opts: {splitMode: this.state.splitMode, currency: this.state.currency, amount: this.state.amount}});
        }
    }
}

export default GroupExpense;
