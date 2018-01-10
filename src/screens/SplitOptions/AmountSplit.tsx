import React, { Component, ReactNode } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import PersonPicker from '../../components/Pickers/PersonPicker';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetGroupState } from '../../utils/navigationactions';
import { showError } from '../../utils/popup';
import {backgroundColorStyles, specificStyles, standardStyles} from '../screenStyles';

interface Options {
    splitMode: boolean;
    currency: Currency;
    currencies: Currencies;
    amount: number;
    description: string;
    category: string;
    date: string;
    image: any;
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
    splitEven: boolean;
}

export default class AmountSplit extends Component<IDefaultNavProps, IState> {

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
                date: options.date,
                image: options.image
            },
            payers: [] as Balances,
            payerNodes: [] as Array<ReactNode>,
            sum: 0,
            chosen: [] as PersonList,
            personArray: [] as PersonList,
            expenseArray: [] as ExpenseList,
            currencies: options.currencies as Currencies,
            splitEven: this.props.navigation.state.params.opts.splitMode
        };
    }

    render() {
        const { goBack, dispatch } = this.props.navigation;
        let height = Dimensions.get('window').height;

        let splitter = this.state.expense.balances.map((val: Balance, key: number) => {
            return <BillSplitterItem key={key} keyval={val.person.id} val={val.person.firstname + ' ' + val.person.lastname} amount={val.amount * (-1)}
                onChangeText={this.update.bind(this)} />;
        });

        return (
            <View style={ [specificStyles.container, backgroundColorStyles.lightGreen] }>
                <StatusBar translucent={false} barStyle='light-content' />

                <View style={ [standardStyles.flex, { height: height * 0.1 }] }>
                    <Text style={ specificStyles.title }>{this.state.options.description}</Text>
                </View>

                <KeyboardAvoidingView>
                    <ScrollView style={{ height: height * 0.67, borderStyle: 'dashed', borderWidth: 0.5, borderRadius: 1, padding: 5 }} keyboardShouldPersistTaps={'always'} keyboardDismissMode='on-drag'>
                        <Text style={ [ standardStyles.boldText, { borderBottomWidth: 1 }] }>Payers</Text>
                        <PersonPicker persons={this.state.personArray} choose={this.addPayer.bind(this)} style={{ height: height * 0.2 }} />
                        <View style={{ borderTopWidth: 0.5 }}>{this.state.payerNodes}</View>
                        <Text style={ [ standardStyles.boldText, { borderBottomWidth: 1 }] }>Receivers</Text>
                        <View>{splitter}</View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={ standardStyles.flexCenter }>
                    <Text style={ [standardStyles.boldText, { fontSize: 16 }]}>Total: {this.state.options.currency.symbol}{this.state.expense.amount}</Text>
                </View>

                <View style={ standardStyles.rowContainer }>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ specificStyles.leftButton } buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ specificStyles.rightButton } onPress={() => this.confirm(dispatch)} buttonText={'ADD'} />
                    </View>
                </View>
            </View>
        );
    }

    update(amount: number, id: string) {
        let balances = this.state.expense.balances;
        let balance = balances.find((val: Balance) => {
            return (val.person.id === id);
        });
        if (typeof balance !== 'undefined') {
            balance.amount = amount * (-1); // 'Received' money gives a negative balance
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
            nodes.push(<BillSplitterItem key={p.id} keyval={p.id} val={p.firstname + ' ' + p.lastname} amount={0} onChangeText={this.setPayerAmount.bind(this)} />);
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

    confirm(dispatch: any) {
        this.fixBalances()
            .then(() => this.addExpenseToStorage())
            .then(() => resetGroupState(this.state.group, this.state.expenseArray, dispatch))
            .catch((error: string) => { console.log(error); showError(error); });
    }

    async fixBalances() {
        let payer;
        let sum = 0;
        let expense = Object.assign({}, this.state.expense);
        expense.balances.map((val: Balance) => {
            sum += val.amount;
        });
        this.state.payers.map((val: Balance) => sum += val.amount);

        if (sum === 0 || Math.abs(sum) < expense.balances.length * 0.01) {
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
            await this.setState({ expense });

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
                'balances': this.state.expense.balances,
                'image': this.state.expense.image
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
            const avg = (this.state.options.splitMode) ? parseFloat(((this.state.options.amount / personArray.length) * (-1)).toFixed(2)) : 0;
            let diff = (personArray.length * avg) - this.state.options.amount;
            let bool = (diff > 0);
            personArray.map((val: Person) => {
                amounts.push({ person: val, amount: (bool) ? avg + 0.01 : avg });
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