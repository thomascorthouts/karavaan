import React, { Component } from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {currencies} from '../../config/Data';

interface Options {
    splitMode: boolean;
    currency: string;
    amount: number;
    description: string;
}

interface IProps {
    navigation: any;
};

interface IState {
    group: Group;
    options: Options;
    expense: Expense;
    currencies: Currencies;
    donor: string;
    receiver: string;
    expenseArray: ExpenseList;
    personArray: PersonList;
};

class TransSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            group: this.props.navigation.state.params.group,
            options: this.props.navigation.state.params.opts,
            expense: {
                balances: [],
                description: this.props.navigation.state.params.opts.description,
                amount: this.props.navigation.state.params.opts.amount,
                currency:  this.props.navigation.state.params.opts.currency,
                category: this.props.navigation.state.params.opts.category,
                date: date.getDay() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()
            },
            currencies: currencies,
            donor: '',
            receiver: '',
            expenseArray: [],
            personArray: [] as PersonList
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <InputWithCurrencySelector currentCurrency={ this.state.expense.currency } currencies={this.state.currencies}
                                           value={ this.state.expense.amount.toString() }
                                           onChangeText={(value: number) => {
                                               const expense = Object.assign({}, this.state.expense, { amount: value });
                                               this.setState({ expense });
                                           }}
                                           onValueChange={(currency: string) => {
                                               const expense = Object.assign({}, this.state.expense, { currency: this.state.currencies[currency] });
                                               this.setState({ expense });
                                           }}
                                            selectedValue= { this.state.expense.currency }/>
                <InputWithLabel labelText={'Donor'} onChangeText={(donor: any) => this.setState({donor})}/>
                <InputWithLabel labelText={'Receiver'} onChangeText={(receiver: any) => this.setState({receiver})}/>
                <Button title={'Add Transaction'} onPress={() => this.addTransaction(navigate)}/>
            </View>
        );
    }

    isDonor(person: Person) {
        return person.id === this.state.donor;
    }

    isReceiver(person: Person) {
        return person.id === this.state.receiver;
    }

    addTransaction (navigate: any) {
        let balances = [{person: this.state.personArray.find(this.isDonor), amount: this.state.expense.amount, currency: this.state.expense.currency}, {person: this.state.personArray.find(this.isReceiver), amount: this.state.expense.amount * (-1), currency: this.state.expense.currency}];
        const expense = Object.assign({}, this.state.expense, { balances: balances });
        this.setState({ expense });
        this.addExpenseToStorage()
            .then(() => {
                navigate( 'GroupFeed' );
            });
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'description': this.state.expense.description,
                'category': this.state.expense.category,
                'balances': this.state.expense.balances
            });

            await AsyncStorage.setItem('expenses-' + this.state.group.id, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            console.log(error);
        }
    }

    async componentWillMount() {
        console.log(this.state.group);
        console.log(this.state.group.id);
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                }
            });

        AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        personArray: JSON.parse(value)
                    });
                }
            });

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
