import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar, AsyncStorage, NetInfo, StyleSheet, Image, Dimensions } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetState, resetGroupState } from '../../utils/navigationactions';
import { showError, confirmDelete } from '../../utils/popup';

interface IState {
    key: number;
    expense: Expense;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    balances: ReactNode[];
    failed: boolean;
    group: Group;
}

class ExpenseDetail extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        this.state = {
            key: navParams.key,
            expense: navParams.expense,
            expenseArray: navParams.expenseArray,
            expenseArrayId: navParams.expenseArrayId,
            balances: [],
            group: navParams.group,
            failed: false
        };
    }

    render() {
        let { image } = this.state.expense;
        let { height, width } = Dimensions.get('window');
        const { dispatch, goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <View style={styles.flex}>
                    <Text style={styles.title}>{this.state.expense.description}</Text>
                    <Text> </Text>
                    <Text style={styles.textCenter}>Date: {this.state.expense.date}</Text>
                    <Text style={styles.textCenter}>Currency used: {this.state.expense.currency.name}</Text>
                    <Text> </Text>
                    <Text style={styles.textCenter}> - - - </Text>
                    <Text> </Text>

                    <ScrollView>
                        <View>{this.state.balances.length > 0 ? this.state.balances : <Text>Calculating</Text>}</View>
                    </ScrollView>
                </View>

                {image &&
                    <View style={styles.flex}>
                        <Image source={{ uri: image }} style={{ flex: 1, width: width - 40, height: height * 0.2, resizeMode: 'contain' }} />
                    </View>}

                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} buttonText={'DELETE'} onPress={() => confirmDelete('expense', () => this.deleteExpense(dispatch))} />
                    </View>
                </View>

            </View>
        );
    }

    deleteExpense(dispatch: any) {
        this.state.expenseArray.splice(this.state.key, 1);

        this.updateStorage()
            .then(() => {
                if (this.state.expenseArrayId === 'expenses') {
                    resetState('ExpenseFeed', dispatch);
                } else {
                    resetGroupState(this.state.group, this.state.expenseArray, dispatch);
                }
            });
    }

    async getExchangeRate(date: string, base: Currency, current: string) {
        let headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };

        fetch('http://api.fixer.io/' + date + '?base=' + base.tag + '&symbols=' + current, { method: 'GET', headers: headers, body: null })
            .then((resp) => resp.json())
            .then((data) => {
                const expense = JSON.parse(JSON.stringify(this.state.expense));
                if (data.rates) {
                    expense.currency.base = base.tag;
                    expense.currency.date = date;
                    expense.currency.rate = data.rates[current];
                    const expenseArray = [...this.state.expenseArray];
                    expenseArray[this.state.key] = expense;
                    this.setState({ expense, expenseArray }, () => {
                        AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
                        this.createBalances(expense, base, data.rates[current], true);
                        this.props.navigation.state.params.updateFeedState({ expenseArray: this.state.expenseArray });
                    });
                } else {
                    this.createBalances(expense, base, 0, false);
                    throw data.error;
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ failed: true }, () => this.createBalances(this.state.expense, base, 0, false));
            });
    }

    calculateExchangeRate(defaultCurrency: Currency) {
        let expense = this.state.expense;
        const rate = expense.currency.rate;
        if (rate && expense.date === expense.currency.date && expense.currency.base === defaultCurrency.tag) {
            this.createBalances(expense, defaultCurrency, rate, true);
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected && !this.state.failed && expense.currency.tag !== defaultCurrency.tag) {
                    this.getExchangeRate(expense.date, defaultCurrency, expense.currency.tag);
                } else {
                    this.createBalances(expense, defaultCurrency, 0, false);
                }
            });
        }
    }

    createBalances(expense: Expense, defaultCurrency: Currency, rate: number, uptodate: boolean) {
        let text = [] as ReactNode[];
        let needConversion = expense.currency.tag !== defaultCurrency.tag && uptodate;

        this.state.expense.balances.map((balance: Balance, index: number) => {
            let conversion = (needConversion) ? '(=' + defaultCurrency.symbol + Math.abs((balance.amount / rate)).toFixed(2) + ')' : '';
            if (balance.amount > 0) {
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} paid {expense.currency.symbol}{balance.amount} {conversion}
                    </Text>
                );
            } else {
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} owes {expense.currency.symbol}{balance.amount * -1} {conversion}
                    </Text>
                );
            }
        });
        this.setState({ balances: text });
    }

    async updateStorage() {
        try {
            await AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            showError(error);
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('defaultCurrency')
            .then((value) => {
                if (value) {
                    this.calculateExchangeRate(JSON.parse(value));
                }
            });
    }
}

export default ExpenseDetail;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 10
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 30,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textCenter: {
        textAlign: 'center'
    }
});
