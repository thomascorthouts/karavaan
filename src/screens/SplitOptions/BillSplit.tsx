import React, { Component, ReactNode } from 'react';
import { View, ScrollView, AsyncStorage, Text, StyleSheet } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import PersonPicker from '../../components/Pickers/PersonPicker';
import { ErrorText } from '../../components/Text/ErrorText';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetGroupState } from '../../utils/navigationactions';

interface Options {
    splitMode: boolean;
    currency: Currency;
    amount: number;
    description: string;
    category: string;
    date: string;
}

interface IProps {
    navigation: any;
}

interface IState {
    group: Group;
    options: Options;
    expense: Expense;
    payers: Balances;
    dishes: Array<Dish>;
    expenseArray: ExpenseList;
    personArray: PersonList;
    items: Array<ReactNode>;
    payerNodes: Array<ReactNode>;
    error: string;
}

class BillSplit extends Component<IProps, IState> {

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
                date: options.date
            },
            payers: [] as Balances,
            payerNodes: [] as Array<ReactNode>,
            dishes: [] as Array<Dish>,
            expenseArray: [] as ExpenseList,
            personArray: [] as PersonList,
            items: [] as Array<ReactNode>,
            error: ''
        };
    }

    render() {
        const { goBack, dispatch, navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.options.description}</Text>
                <ErrorText errorText={this.state.error} />
                <View style={styles.flex}>
                    <View style={styles.flex}>
                        <PersonPicker persons={this.state.personArray} choose={this.addPayer.bind(this)}  />
                    </View>
                    <ScrollView>
                        {this.state.payerNodes}
                    </ScrollView>
                </View>
                <View style={{flex: 0.8}}>
                    <GreenButton onPress={() => this.addItem(navigate)} buttonText={'Add Item'} />
                    <ScrollView>
                        {this.state.items}
                    </ScrollView>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} onPress={() => this.confirm(dispatch)} buttonText={'ADD'} />
                    </View>
                </View>
            </View>
        );
    }

    addPayer(id: string) {
        let chosen = this.state.payers;
        let nodes = this.state.payerNodes;
        const p = this.state.personArray.find((val: Person) => { return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push({ person: p, amount: 0 });
            nodes.push(<BillSplitterItem key={p.id} keyval={p.id} val={p.firstname + ' ' + p.lastname} amount={0} submitEditing={() => undefined} onChangeText={this.setPayerAmount.bind(this)} />);
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

    addItem(navigate: any) {
        navigate('AddItem', { persons: this.state.personArray, addItem: this.addItemToItems.bind(this) });
    }

    addItemToItems(item: Dish) {
        let items = this.state.dishes;
        items.push(item);
        this.setState({ dishes: items }, this.updateItems);
    }

    updateItems() {
        let items = this.state.dishes.map((val: Dish) => {
            return (<BillSplitterItem key={val.name} keyval={val.id} val={val.name} amount={val.amount} onChangeText={this.setItemAmount.bind(this)} submitEditing={() => this.submitEditing()} />);
        });

        this.setState({ items });
    }

    setItemAmount(amount: number, id: string) {

        let dishes = this.state.dishes;
        let dish = dishes.find((val: Dish) => { return (val.id === id); });
        if (typeof dish !== 'undefined') {
            dish.amount = amount;
            this.setState({ dishes }, this.updateItems);
        }
    }

    submitEditing() {
        // Hiep hoi lege functie
    }

    confirm(dispatch: any) {
        this.createBalances()
            .then(() => this.addExpenseToStorage())
            .then(() => resetGroupState(this.state.group, this.state.expenseArray, dispatch))
            .catch((error: string) => this.setState({ error }));
    }

    async createBalances() {
        let balances = this.state.payers; // begin from payers as base
        let avg: number;
        let bal;
        let sum = 0;
        this.state.payers.map((val: Balance) => sum += val.amount);
        this.state.dishes.map((item: Dish) => sum -= item.amount);

        if (sum === 0) {
            this.state.dishes.map((item: Dish) => {
                avg = item.amount / item.users.length;
                item.users.map((val: Person) => {
                    bal = balances.find((balance: Balance) => {
                        return (balance.person.id === val.id);
                    });
                    if (typeof bal === 'undefined') {
                        bal = { person: val, amount: 0 };
                        balances.push(bal);
                    }
                    bal.amount -= parseFloat(avg.toFixed(2));
                });
            });

            let expense = Object.assign({}, this.state.expense, { balances: balances });
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

        this.setState({ personArray, expenseArray });
    }
}

export default BillSplit;

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