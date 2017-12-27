import React, {Component, ReactNode} from 'react';
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
    payers: Balances;
    payerNodes: Array<ReactNode>;
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
            payers: [] as Balances,
            payerNodes: [] as Array<ReactNode>,
            sum: 0,
            chosen: [] as PersonList,
            personArray: friendList,
            expenseArray: [] as ExpenseList,
            currencies: {} as Currencies
        };
    }

    update(text: string, id: string) {
        let balances = this.state.expense.balances;
        let balance = balances.find((val: Balance) => {
            return (val.person.id === id);
        });
        if (typeof balance !== 'undefined') {
            balance.amount = parseFloat(text);
            let expense = Object.assign({}, this.state.expense, {balances: balances});
            this.setState({expense});
        }
    }
    render() {
        const { navigate } = this.props.navigation;

        let splitter = this.state.expense.balances.map((val: Balance, key: number) => {
            return <BillSplitterItem key={key} keyval={key} val={val.person.firstname + ' ' + val.person.lastname} amount={val.amount}
                                     onChangeText={(text: number) => this.update.bind(this, text, val.person.id)}
                                     submitEditing={() => this.submitEditing()}/>;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <Text>{this.state.options.description}</Text>
                <ScrollView>
                    <PersonPicker persons={this.state.personArray} choose={this.addPayer.bind(this)}/>
                    {this.state.payerNodes}
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

    addPayer(id: string) {
        let chosen = this.state.payers;
        let nodes = this.state.payerNodes;
        const p = this.state.personArray.find((val: Person) => {return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push({ person: p, amount: 0 });
            this.setState({payers: chosen});
            nodes.push(<BillSplitterItem key={p.id} keyval={p.id} val={p.id} amount={0} submitEditing={() => undefined} onChangeText={(amount: any) => this.setPayerAmount.bind(this, amount, p.id)}/>);
            this.setState({payerNodes: nodes});
        }
        console.log(this.state.payers);
    }

    setPayerAmount (amount: number, id: string) {
        let payers = this.state.payers;
        let bal = payers.find((val: Balance) => { return (val.person.id === id); });
        if (typeof bal !== 'undefined') {
            bal.amount += amount;
            this.setState({payers});
        }
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
            amounts.push({ person: val, amount: avg});
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