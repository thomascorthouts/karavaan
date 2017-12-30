import React, { Component } from 'react';
import {View, Picker, Button, AsyncStorage, StatusBar} from 'react-native';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {CategoryPicker} from '../../components/Pickers/CategoryPicker';
import {parseMoney} from '../../util';
import {currencies} from '../../config/Data';

interface IState {
    description: string;
    group: Group;
    currency: string;
    amount: number;
    splitMode: string;
    category: string;
    amountString: string;
}

class GroupExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            description: '',
            group: this.props.navigation.state.params.group,
            currency: 'EUR',
            amount: 0,
            splitMode: 'trans',
            category: 'Entertainment',
            amountString: ''
        };
    }

    render() {
            const {navigate} = this.props.navigation;
            return (
                <View>
                    <StatusBar hidden={true}/>
                    <InputWithLabel labelText={'description'} onChangeText={(description: any) => this.setState({description})}/>
                    <InputWithCurrencySelector currentCurrency={ this.state.currency } currencies={this.state.group.defaultCurrencies}
                                               value={ this.state.amountString }
                                               onChangeText={(amount: string) => this.updateAmount(amount) }
                                               onValueChange={(currency: any) => { this.setState({currency}); }} selectedValue= { this.state.currency }/>
                    <CategoryPicker onValueChange={this.updateCategory.bind(this)} selectedValue={this.state.category}/>
                    <Picker selectedValue={this.state.splitMode} onValueChange={(splitMode: any) => this.setState({splitMode})}>
                        <Picker.Item label={'Transaction'} value={'trans'} key={'trans'}/>
                        <Picker.Item label={'Split evenly'} value={'even'} key={'even'}/>
                        <Picker.Item label={'Bill Splitter'} value={'bill'} key={'bill'}/>
                        <Picker.Item label={'Exact amounts'} value={'amounts'} key={'amounts'}/>
                    </Picker>
                    <Button title={'NEXT'} onPress={() => this.nextScreen(navigate)}/>
                </View>
            );
    }

    updateAmount (value: string) {
        let amount = parseMoney(value);
        this.setState({ amountString: amount });
        this.setState({ amount: parseFloat(amount) });
    }

    updateCategory(cat: string) {
        this.setState({category: cat});
    }

    nextScreen = (navigate: any) => {
        // We should add currencies by opts

        const props = {group:  this.state.group , opts: { description: this.state.description, currencies: this.state.group.defaultCurrencies, splitMode: (this.state.splitMode === 'even'), currency: this.state.group.defaultCurrencies[this.state.currency], amount: this.state.amount, category: this.state.category }};
        if (this.state.splitMode === 'bill') {
           navigate('GroupAddBill', props);
        } else if (this.state.splitMode === 'trans') {
            navigate('GroupAddTransaction', props);
        } else {
            navigate('GroupAddByAmount', props);
        }
    }
}

export default GroupExpense;
