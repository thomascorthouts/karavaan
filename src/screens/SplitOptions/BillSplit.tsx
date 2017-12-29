import React, { Component, ReactNode } from 'react';
import {View, Button, ScrollView, AsyncStorage, Text} from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import PersonPicker from '../../components/Pickers/PersonPicker';
import {ErrorText} from '../../components/Text/ErrorText';

interface Options {
    splitMode: boolean;
    currency: string;
    amount: number;
    description: string;
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

        let date = new Date();
        this.state = {
            group: this.props.navigation.state.params.group as Group,
            options: this.props.navigation.state.params.opts as Options,
            expense: {
                balances: [],
                description: this.props.navigation.state.params.opts.description,
                amount: this.props.navigation.state.params.opts.amount,
                currency:  this.props.navigation.state.params.opts.currency.tag,
                category: this.props.navigation.state.params.opts.category,
                date: date.getDay() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()
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

    componentWillMount() {

        AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        personArray: JSON.parse(value)
                    });
                }
            });

        console.log(this.state.personArray);
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                }
            });
    }

    render() {
        const {navigate} = this.props.navigation;

        return (
            <View>
                <Text>{this.state.expense.description}</Text>
                <ErrorText errorText={this.state.error}/>
                <ScrollView>
                    <PersonPicker persons={this.state.personArray} choose={this.addPayer.bind(this)}/>
                    {this.state.payerNodes}
                </ScrollView>
                <Button title={'Add Item'} onPress={ () => this.addItem(navigate)}/>
                <ScrollView >
                    {this.state.items}
                </ScrollView>
                <Button title={'Add Expense'} onPress={() => this.confirm(navigate)}/>
            </View>
        );
    }

    addPayer(id: string) {
        let chosen = this.state.payers;
        let nodes = this.state.payerNodes;
        const p = this.state.personArray.find((val: Person) => {return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push({ person: p, amount: 0 });
            this.setState({payers: chosen});
            nodes.push(<BillSplitterItem key={p.id} keyval={p.id} val={p.id} amount={0} submitEditing={() => undefined} onChangeText={this.setPayerAmount.bind(this)}/>);
            this.setState({payerNodes: nodes});
        }
        console.log(this.state.payers);
    }

    setPayerAmount (amount: number, id: string) {
        let payers = this.state.payers;
        let bal = payers.find((val: Balance) => { return (val.person.id === id); });
        if (typeof bal !== 'undefined') {
            bal.amount = amount;
            this.setState({payers});
        }
    }

    addItem (navigate: any) {
        navigate('AddItem', { persons: this.state.personArray, addItem: this.addItemToItems.bind(this)});
    }

    addItemToItems(item: Dish) {
        let items = this.state.dishes;
        items.push(item);
        this.setState({dishes: items}, this.updateItems);
    }

    updateItems() {
        let items = this.state.dishes.map((val: Dish) => {
            return (<BillSplitterItem key={val.name} keyval={val.id} val={val.name} amount={val.amount} onChangeText={this.setItemAmount.bind(this)} submitEditing={() => this.submitEditing()}/>);
        });

        this.setState({items});
    }

    setItemAmount(amount: number, id: string) {
        console.log(amount);
        console.log(id);
        let dishes = this.state.dishes;
        let dish = dishes.find((val: Dish) => {return (val.id === id); });
        if (typeof dish !== 'undefined') {
            dish.amount = amount;
            this.setState({dishes}, this.updateItems);
        }
    }

    submitEditing() {
        // Hiep hoi lege functie
    }

    confirm(navigate: any) {
        this.createBalances()
            .then(() => this.addExpenseToStorage())
            .then(() => navigate( 'GroupFeed' ))
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
                        bal = {person: val, amount: 0};
                        balances.push(bal);
                    }
                    bal.amount -= avg;
                });
            });

            this.state.expense.balances.map((val: Balance) => val.person.balance += val.amount);

            let expense = Object.assign({}, this.state.expense, {balances: balances});
            this.setState({expense});
            this.setState({ error: '' });
        } else throw 'The total balance is not 0.';
    }

    async addExpenseToStorage() {
        console.log(this.state.expense.balances);
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
}

export default BillSplit;
