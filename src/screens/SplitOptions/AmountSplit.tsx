import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import { friendList } from '../../config/Data';
import PersonPicker from '../../components/Pickers/PersonPicker';

interface Options {
    splitMode: boolean;
    currency: Currency;
    amount: number;
    description: string;
    category: string;
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
};

class AmountSplit extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
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
            sum: 0,
            chosen: [] as PersonList,
            personArray: friendList,
            expenseArray: [] as ExpenseList,
            currencies: {} as Currencies
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let splitter = this.state.expense.balances.map((val: Balance, key: number) => {
            return <BillSplitterItem key={key} keyval={key} val={val.person.firstname + ' ' + val.person.lastname} amount={val.amount} submitEditing={() => this.submitEditing()}/>;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <Text>{this.state.options.description}</Text>
                <ScrollView>
                    <Text> Who Payed? </Text>
                    <PersonPicker persons={this.state.personArray} choose={this.choose.bind(this)}/>
                </ScrollView>
                <ScrollView>
                    <Text> Here should come the input they have payed.</Text>
                </ScrollView>
                <Text>Receivers</Text>
                <ScrollView style={styles.ScrollContainer}>
                    {splitter}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <Text>Total: {this.state.options.currency.symbol}{this.state.expense.amount}</Text>
                    <Button onPress={() => this.confirm(navigate)} title={'Add Expense'} />
                </KeyboardAvoidingView>
            </View>
        );
    }

    choose(id: string) {
        let chosen = this.state.chosen;
        const p = this.state.personArray.find((val: Person) => {return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push(p);
            this.setState({chosen});
        }
        console.log(this.state.chosen);
    }

    submitEditing() { }

    confirm(navigate: any) {
        this.addExpenseToStorage()
            .then(() => {
                navigate( 'GroupFeed' );
            });
    }

    async addExpenseToStorage() {
        console.log(this.state.chosen);
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
        } catch (error) {
            console.log(error);
        }
    }

    componentWillMount() {

       // Asyncstorage get Persons should be added when this functionality is integrated

        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                }
            });

        let amounts = [] as Balances;
        const avg = (this.state.options.splitMode) ? (this.state.options.amount / this.state.personArray.length) : 0;
        this.state.personArray.map((val: Person, index: number) => {
            amounts.push({ person: val, amount: avg, currency: this.props.navigation.state.params.opts.currency });
        });
        let expense = Object.assign({}, this.state.expense, {balances: amounts});
        this.setState({expense});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    addButton: {
        backgroundColor: '#287E6F',
        width: 90,
        height: 90,
        borderRadius: 50,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        zIndex: 10
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 24
    }
});

export default AmountSplit;