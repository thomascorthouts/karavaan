import React, { Component, ReactNode } from 'react';
import { View, ScrollView, AsyncStorage, Picker, Button, StyleSheet } from 'react-native';
import { TransactionFeedItem } from '../../components/TransactionFeedItem';
import {getRate} from '../../utils/getRate';
import {currencies} from '../../config/Data';
import {CurrencyPicker} from '../../components/Pickers/CurrencyPicker';

interface Transaction {
    from: Person;
    to: Person;
    amount: number;
}

interface Transactions extends Array<Transaction> { }

interface IState {
    group: Group;
    numberOfTransactions: number;
    transactions: Transactions;
    personPickerItems: Array<ReactNode>;
    pickerOpt: string;
    currencies: Currencies;
    currency: Currency;
    rate: number;
    expenseArrayId: string;
}

export default class TransactionsSummary extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = (typeof state.params.group.name !== 'undefined') ? state.params.group.name : 'Summaries';
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', { group: state.params.group, groupArray: state.params.groupArray, update: true })
            } />;
            return {
                headerTitle: `${title}`,
                headerRight: headerRight
            };
        } else {
            return {};
        }
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        let bool = Object.keys(navParams.group).length !== 0;
        this.state = {
            group: bool ? this.props.navigation.state.params.group : {} as Group,
            numberOfTransactions: Infinity,
            transactions: [] as Transactions,
            pickerOpt: 'all',
            personPickerItems: [] as ReactNode[],
            currencies: currencies,
            currency: bool ? navParams.group.defaultCurrency : {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            },
            rate: 1,
            expenseArrayId: bool ? 'expenses-' + navParams.group.id : 'expenses'
        };
    }

    render() {
        let trans = this.state.transactions.filter((val: Transaction) => {
            if (this.state.pickerOpt === 'all') return true;
            else return val.from.id === this.state.pickerOpt || val.to.id === this.state.pickerOpt;
        }).map((val: Transaction) => {
            return (<TransactionFeedItem key={val.from.id + val.to.id} keyval={val.from.id + val.to.id} transaction={val} rate={this.state.rate} currencySymbol={this.state.currency.symbol} />);
        });
        if (Object.getOwnPropertyNames(trans).length === 0) {
            trans = [];
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {trans}
                </ScrollView>

                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <Picker selectedValue={this.state.pickerOpt} onValueChange={(val: string) => this.setState({ pickerOpt: val })}>
                            <Picker.Item label={'All Users'} value={'all'} key={'all'} />
                            {this.state.personPickerItems}
                        </Picker>
                    </View>
                    <View style={styles.flex}>
                        <CurrencyPicker currencies={this.state.currencies} onValueChange={(curr: Currency) => this.updateRate(curr)} selectedValue={this.state.currency}/>
                    </View>
                </View>
            </View>
        );
    }

    updateRate(curr: Currency) {
        this.setState({rate: getRate(this.state.currency.tag, curr.tag, this.state.currencies), currency: curr});
    }

    algorithm(balances: Balances) {
        let transactions: Array<Transaction> = []; // This will be an array of objects of form Transaction
        let tos = [] as Balances;
        let froms = [] as Balances;

        balances.map((val: Balance) => (val.amount > 0) ? tos.push(val) : froms.push(val));

        transactions = this.backtracking(froms, tos, transactions);
        return transactions;
    }

    backtracking(froms: Balances, tos: Balances, transactions: Array<Transaction>) {

        // Filter out the balances with amount 0, because that would be useless iterations.
        froms = froms.filter((val: Balance) => { return val.amount !== 0; });
        tos = tos.filter((val: Balance) => { return val.amount !== 0; });

        if (froms.length === 0 || tos.length === 0) {
            this.setState({ numberOfTransactions: transactions.length });
            return transactions;
        }

        // Backtracking
        let amount = 0;
        froms.filter((val: Balance) => { return val.amount !== 0 && !isNaN(val.amount); }).map((negBal: Balance) => {
            tos.filter((val: Balance) => { return val.amount !== 0 && !isNaN(val.amount); }).map((posBal: Balance) => {
                amount = Math.min(Math.abs(negBal.amount), posBal.amount);
                if (amount !== 0) {
                    negBal.amount += amount;
                    posBal.amount -= amount;
                    transactions.push({
                        from: negBal.person,
                        to: posBal.person,
                        amount: amount
                    });
                    let t = this.backtracking(froms, tos, transactions);
                    if (t && t.length < transactions.length) {
                        transactions = t;
                    }
                }
            });
        });

        return transactions;
    }

    componentDidMount() {
        let currencies = {};
        AsyncStorage.getItem('currencies')
            .then((value: string) => {
                if (value) currencies = JSON.parse(value).rates;
            });

        let rate = 1;
        let balances: Balances = [];
        AsyncStorage.getItem(this.state.expenseArrayId)
            .then((value: string) => {
                let expenses = JSON.parse(value);
                if (expenses) {
                    expenses.map((val: Expense) => {
                        val.balances.map((bal: Balance) => {
                            let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                            rate = (val.currency.tag === this.state.currency.tag) ? 1 : getRate(val.currency.tag, this.state.currency.tag, currencies);
                            bal.amount = bal.amount * rate;
                            bal.amount = (bal.amount > 0) ? Math.floor(bal.amount * Math.pow(10, 2)) / Math.pow(10, 2) : Math.ceil(bal.amount * Math.pow(10, 2)) / Math.pow(10, 2);

                            if (typeof balFound !== 'undefined') balFound.amount += bal.amount;
                            else balances.push(bal);
                        });
                    });
                    let items: ReactNode[] = [];
                    balances.map((val: Balance) => {
                        items.push(<Picker.Item label={val.person.firstname + ' ' + val.person.lastname}
                                                value={val.person.id} key={val.person.id}/>);
                    });
                    this.setState({personPickerItems: items, transactions: this.algorithm(balances)});
                }
            });
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row'
    }
});