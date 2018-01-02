import React, { Component, ReactNode } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, StyleSheet } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import PersonPicker from '../../components/Pickers/PersonPicker';
import { ErrorText } from '../../components/Text/ErrorText';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetGroupState } from '../../utils/navigationactions';

interface Options {
    splitMode: boolean;
    currency: Currency;
    currencies: Currencies;
    amount: number;
    description: string;
    category: string;
    date: string;
}

interface IState {
    expense: Expense;
    group: Group;
    options: Options;
    sum: number;
    personArray: PersonList;
    expenseArray: ExpenseList;
    currencies: Currencies;
    chosen: PersonList;
    payers: Balances;
    payerNodes: Array<ReactNode>;
    error: string;
}

class AmountSplit extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
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
                date: options.date
            },
            payers: [] as Balances,
            payerNodes: [] as Array<ReactNode>,
            sum: 0,
            chosen: [] as PersonList,
            personArray: [] as PersonList,
            expenseArray: [] as ExpenseList,
            currencies: options.currencies as Currencies,
            error: ''
        };
    }

    render() {
        const { goBack, dispatch } = this.props.navigation;

        let splitter = this.state.expense.balances.map((val: Balance, key: number) => {
            return <BillSplitterItem key={key} keyval={val.person.id} val={val.person.firstname + ' ' + val.person.lastname} amount={val.amount * (-1)}
                onChangeText={this.update.bind(this)}
                submitEditing={() => this.submitEditing()} />;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <KeyboardAvoidingView>
                    <View style={styles.flex}>
                        <Text style={styles.title}>{this.state.options.description}</Text>
                    </View>
                    <ErrorText errorText={this.state.error} />
                    <View>
                        <Text>Payers</Text>
                        <PersonPicker persons={this.state.personArray} choose={this.addPayer.bind(this)} />
                        <ScrollView>
                            {this.state.payerNodes}
                        </ScrollView>
                    </View>
                    <View>
                        <Text>Receivers</Text>
                        <ScrollView>
                            {splitter}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
                <View>
                    <Text>Total: {this.state.options.currency.symbol}{this.state.expense.amount}</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.flex}>
                            <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                        </View>
                        <View style={styles.flex}>
                            <GreenButton buttonStyle={{ marginLeft: 2 }} onPress={() => this.confirm(dispatch)} buttonText={'ADD'} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    update(text: string, id: string) {
        let balances = this.state.expense.balances;
        let balance = balances.find((val: Balance) => {
            return (val.person.id === id);
        });
        if (typeof balance !== 'undefined') {
            balance.amount = parseFloat(text) * (-1); // 'Received' money gives a negative balance
            let expense = Object.assign({}, this.state.expense, { balances: balances });
            this.setState({ expense });
        }
    }

    addPayer(id: string) {
        let chosen = this.state.payers;
        let nodes = this.state.payerNodes;
        const p = this.state.personArray.find((val: Person) => { return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push({ person: p, amount: 0 });
            nodes.push(<BillSplitterItem key={p.id} keyval={p.id} val={p.id} amount={0} submitEditing={() => this.submitEditing()} onChangeText={this.setPayerAmount.bind(this)} />);
            this.setState({ payers: chosen, payerNodes: nodes });
        }
    }

    setPayerAmount(amount: number, id: string) {
        let payers = this.state.payers;
        let bal = payers.find((val: Balance) => { return (val.person.id === id); });
        if (typeof bal !== 'undefined') {
            bal.amount = amount;
            this.setState({ payers });
        }
    }

    submitEditing() {
        // empty
    }

    confirm(dispatch: any) {
        this.fixBalances()
            .then(() => this.addExpenseToStorage())
            .then(() => resetGroupState(this.state.group, this.state.expenseArray, dispatch))
            .catch((error: string) => this.setState({ error }));
    }

    async fixBalances() {
        let payer;
        let sum = 0;
        let expense = Object.assign({}, this.state.expense);
        expense.balances.map((val: Balance) => {
            sum += val.amount;
        });
        this.state.payers.map((val: Balance) => sum += val.amount);

        if (sum === 0) {
            this.state.payers.map((payerBalance: Balance) => {
                payer = expense.balances.find((bal: Balance) => {
                    return bal.person.id === payerBalance.person.id;
                });
                if (typeof payer !== 'undefined') {
                    payer.amount += payerBalance.amount;
                } else {
                    let balanceToPush = Object.assign({}, payerBalance);
                    expense.balances.push(balanceToPush);
                }
            });
            this.setState({ expense, error: '' });

        } else throw 'The total balance is not 0.';
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

        let expense;
        if (personArray) {
            let amounts = [] as Balances;
            const avg = (this.state.options.splitMode) ? (this.state.options.amount / personArray.length) * (-1) : 0;
            personArray.map((val: Person) => {
                amounts.push({ person: val, amount: avg });
            });
            expense = Object.assign({}, this.state.expense, { balances: amounts });
        }

        if (expense) {
            this.setState({ personArray, expense, expenseArray });
        } else {
            this.setState({ personArray, expenseArray });
        }
    }
}

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

export default AmountSplit;