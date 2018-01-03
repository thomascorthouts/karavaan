import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';
import PersonChooser from '../../components/Pickers/PersonChooser';
import { ErrorText } from '../../components/Text/ErrorText';
import { parseMoney } from '../../utils/parsemoney';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetGroupState } from '../../utils/navigationactions';

interface Options {
    splitMode: boolean;
    currency: Currency;
    amount: number;
    description: string;
    currencies: Currencies;
    date: string;
    category: string;
    image: any;
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

        let options = this.props.navigation.state.params.opts as Options;
        this.state = {
            group: this.props.navigation.state.params.group,
            options: options,
            expense: {
                balances: [],
                description: options.description,
                amount: options.amount,
                currency: options.currency,
                category: options.category,
                date: options.date,
                image: options.image
            },
            currencies: options.currencies as Currencies,
            donor: {} as Person,
            receiver: {} as Person,
            expenseArray: [] as ExpenseList,
            personArray: [] as PersonList,
            error: '',
            amountString: options.amount.toString()
        };
    }

    render() {
        const { goBack, dispatch } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.flex}>
                    <Text style={styles.title}>{this.state.options.description}</Text>
                </View>
                <ErrorText errorText={this.state.error} />

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
                <View>
                    <View>
                        <Text>Payer</Text>
                        <PersonChooser persons={this.state.personArray} choose={this.chooseDonor.bind(this)} />
                    </View>
                    <View>
                        <Text>Receiver</Text>
                        <PersonChooser persons={this.state.personArray} choose={this.chooseReceiver.bind(this)} />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} onPress={() => this.addTransaction(dispatch)} buttonText={'ADD'} />
                    </View>
                </View>
            </View>
        );
    }

    updateAmount(value: string) {
        let amount = parseMoney(value);
        const expense = Object.assign({}, this.state.expense, { amount: parseFloat(value) });
        this.setState({ expense, amountString: amount });
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
            else this.setState({ receiver: p });
        }
    }

    addTransaction(dispatch: any) {
        if (!this.state.donor.id || !this.state.receiver.id || this.state.expense.amount === 0) {
            this.setState({ error: 'Not all fields are filled in correctly' });
        } else {
            let donor = this.state.donor;
            let receiver = this.state.receiver;

            let balances = [{
                person: donor,
                amount: this.state.expense.amount,
                currency: this.state.expense.currency
            }, {
                person: receiver,
                amount: this.state.expense.amount * (-1),
                currency: this.state.expense.currency
            }];

            const expense = Object.assign({}, this.state.expense, { balances: balances });
            this.setState({ expense }, () => {
                this.addExpenseToStorage()
                    .then(() => {
                        resetGroupState(this.state.group, this.state.expenseArray, dispatch);
                    });
            });
        }
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'description': this.state.expense.description,
                'category': this.state.expense.category,
                'balances': this.state.expense.balances,
                'image': this.state.expense.image,
                'isTransaction': true
            });

            await AsyncStorage.multiSet([
                ['expenses-' + this.state.group.id, JSON.stringify(this.state.expenseArray)],
                ['persons-' + this.state.group.id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    async componentDidMount() {
        let personArray = await AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.personArray;
                }
            });

        let expenseArray = await AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.expenseArray;
                }
            });

        this.setState({ personArray, expenseArray });
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
