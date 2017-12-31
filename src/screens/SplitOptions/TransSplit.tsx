import React, { Component } from 'react';
import { View, Button, AsyncStorage, StyleSheet } from 'react-native';
import { currencies } from '../../config/Data';
import PersonChooser from '../../components/Pickers/PersonChooser';
import {ErrorText} from '../../components/Text/ErrorText';
import {parseMoney} from '../../utils/parsemoney';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';

interface Options {
    splitMode: boolean;
    currency: Currency;
    amount: number;
    description: string;
    currencies: Currencies;
}

interface IProps {
    navigation: any;
}

interface IState {
    group: Group;
    options: Options;
    expense: Expense;
    currencies: Currencies;
    donor: Person;
    receiver: Person;
    expenseArray: ExpenseList;
    personArray: PersonList;
    error: string;
    amountString: string;
}

class TransSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            group: this.props.navigation.state.params.group,
            options: this.props.navigation.state.params.opts as Options,
            expense: {
                balances: [],
                description: this.props.navigation.state.params.opts.description,
                amount: this.props.navigation.state.params.opts.amount,
                currency: this.props.navigation.state.params.opts.currency,
                category: this.props.navigation.state.params.opts.category,
                date: date.getDay() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()
            },
            currencies: this.props.navigation.state.params.opts.currencies,
            donor: {} as Person,
            receiver: {} as Person,
            expenseArray: [],
            personArray: [] as PersonList,
            error: '',
            amountString: this.props.navigation.state.params.opts.amount.toString()
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        console.log(this.state.expense.currency);
        return (
            <View>
                <ErrorText errorText={this.state.error}/>

                <View style={styles.rowContainer}>
                    <View style={styles.inputAmount}>
                        <InputWithoutLabel
                            onChangeText={(value: string) => this.updateAmount(value)}
                            value={this.state.amountString}
                            returnKeyType={'done'}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={styles.flex}>
                        <CurrencyPicker
                            currencies={this.state.group.currencies}
                            onValueChange={(currency: Currency) => {
                                const expense = Object.assign({}, this.state.expense, { currency: currency });
                                this.setState({ expense });
                            }}
                            selectedValue={this.state.expense.currency}
                        />
                    </View>
                </View>

                <PersonChooser persons={this.state.personArray} choose={this.chooseDonor.bind(this)}/>
                <PersonChooser persons={this.state.personArray} choose={this.chooseReceiver.bind(this)}/>
                <Button title={'Add Transaction'} onPress={() => this.addTransaction(navigate)} />
            </View>
        );
    }

    updateAmount (value: string) {
        let amount = parseMoney(value);
        this.setState({ amountString: amount });
        const expense = Object.assign({}, this.state.expense, { amount: parseFloat(value) });
        this.setState({ expense });
    }

    chooseDonor(id: string) {
        this.choose(id, true);
    }

    chooseReceiver(id: string) {
        this.choose(id, false);
    }

    choose(id: string, isDonor: boolean) {
        let p = this.state.personArray.find((val: Person) => { return (val.id === id); });
        if (typeof p !== 'undefined') {
            if (isDonor) this.setState({ donor: p });
            else this.setState( { receiver: p });
        }
    }

    addTransaction(navigate: any) {
        if (!this.state.donor.id || !this.state.receiver.id || this.state.expense.amount === 0) {
                this.setState({error: 'Not all fields are filled in correctly'});
        } else {
            let donor = this.state.donor;
            donor.balance += this.state.expense.amount;
            let receiver = this.state.receiver;
            receiver.balance -= this.state.expense.amount;

            let balances = [{
                person: donor,
                amount: this.state.expense.amount,
                currency: this.state.expense.currency
            }, {
                person: receiver,
                amount: this.state.expense.amount * (-1),
                currency: this.state.expense.currency
            }];

            const expense = Object.assign({}, this.state.expense, {balances: balances});
            this.setState({expense}, () => {
                this.addExpenseToStorage()
                    .then(() => {
                        navigate('GroupFeed');
                    });
            });
        }
    }

    async addExpenseToStorage() {
        console.log(this.state.expense);
        console.log(this.state.personArray);
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
            await AsyncStorage.setItem('persons-' + this.state.group.id, JSON.stringify(this.state.personArray));
        } catch (error) {
            console.log(error);
        }
    }

    async componentWillMount() {
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
    }

}

export default TransSplit;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputAmount: {
        flex: 3.6
    }
});
