import React, {Component, ReactNode} from 'react';
import {View, ScrollView, Text, AsyncStorage, Picker, Button} from 'react-native';
import {TransactionFeedItem} from '../../components/TransactionFeedItem';

interface Transaction {

    from: Person;
    to: Person;
    amount: number;
}

interface Transactions extends Array<Transaction> {}

interface IState {
    group: Group;
    numberOfTransactions: number;
    transactions: Transactions;
    personPickerItems: Array<ReactNode>;
    pickerOpt: string;
}

export default class TransactionsSummary extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: {navigation: any}) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = state.params.group.name;
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', {group: state.params.group, groupArray: state.params.groupArray, update: true})
            }></Button>;
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
        this.state = {
            group: this.props.navigation.state.params.group,
            numberOfTransactions: Infinity,
            transactions: [] as Transactions,
            pickerOpt: 'all',
            personPickerItems: [] as ReactNode[]
        };
    }

    render() {

        let trans = this.state.transactions.filter((val: Transaction) => {
            if (this.state.pickerOpt === 'all') return true;
            else return val.from.id === this.state.pickerOpt || val.to.id === this.state.pickerOpt;
        }).map((val: Transaction) => {
            return (<TransactionFeedItem key={val.from.id + val.to.id} keyval={val.from.id + val.to.id} transaction={val} currency={this.state.group.defaultCurrency}/>);
        });
        return (
            <View>
                <Picker selectedValue={this.state.pickerOpt} onValueChange={(val: string) => this.setState({pickerOpt: val})}>
                    <Picker.Item label={''} value={'all'} key={'all'} />
                    {this.state.personPickerItems}
                </Picker>
                <ScrollView>
                    {trans}
                </ScrollView>
            </View>
        );
    }

    componentWillMount() {
        let balances: Balances = [];
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value: string) => {
                let expenses = JSON.parse(value);
                if (expenses) {
                    expenses.map((val: Expense) => {
                        val.balances.map((bal: Balance) => {
                            let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                            if (typeof balFound !== 'undefined') balFound.amount += bal.amount;
                            else balances.push(bal);
                        });
                    });
                    let items: ReactNode[] = [];
                    balances.map((val: Balance) => {
                        items.push(<Picker.Item label={val.person.firstname + ' ' + val.person.lastname}
                                                value={val.person.id} key={val.person.id}/>);
                    });
                    this.setState({personPickerItems: items});
                    this.setState({transactions: this.algorithm(balances)});
                }
            });
    }

    algorithm(balances: Balances) {
        let transactions: Array<Transaction> = []; // This will be an array of objects of form Transaction
        let tos = [] as Balances;
        let froms = [] as Balances;

        balances.map((val: Balance) => (val.amount > 0) ? tos.push(val) : froms.push(val));

        transactions = this.backtracking(froms, tos, transactions);
        console.log(transactions);
        return transactions;
    }

    backtracking(froms: Balances, tos: Balances, transactions: Array<Transaction>) {

        // Filter out the balances with amount 0, because that would be useless iterations.
        froms = froms.filter((val: Balance) => { return val.amount !== 0; });
        tos = tos.filter((val: Balance) => { return val.amount !== 0; });

        if (froms.length === 0 || tos.length === 0) {
            this.setState({numberOfTransactions: transactions.length});
            return transactions;
        }
        // Backtracking
        let amount = 0;
        froms.filter((val: Balance) => { return val.amount !== 0; }).map((negBal: Balance) => {
            tos.filter((val: Balance) => { return val.amount !== 0; }).map((posBal: Balance) => {
                amount = Math.min(Math.abs(negBal.amount), posBal.amount);
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
            });
        });
        return transactions;
    }

}