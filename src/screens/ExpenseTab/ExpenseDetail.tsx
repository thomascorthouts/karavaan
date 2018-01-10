import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar, AsyncStorage, NetInfo, StyleSheet, Image, Dimensions } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetState, resetGroupState } from '../../utils/navigationactions';
import { showError, confirmDelete } from '../../utils/popup';
import { backgroundColorStyles, specificStyles, standardStyles } from '../screenStyles';

interface IState {
    key: number;
    expense: Expense;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    balances: ReactNode[];
    failed: boolean;
    group: Group;
    updatedConversion: boolean;
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
            failed: false,
            updatedConversion: false
        };
    }

    render() {
        let { image } = this.state.expense;
        let { height, width } = Dimensions.get('window');
        const { dispatch, goBack } = this.props.navigation;

        return (
            <View style={specificStyles.container}>
                <StatusBar hidden={true} />

                <View style={standardStyles.flex}>
                    <Text style={specificStyles.title}>{this.state.expense.description}</Text>
                    <Text> </Text>
                    <Text style={standardStyles.textCenter}>Date: {this.state.expense.date}</Text>
                    <Text style={standardStyles.textCenter}>Currency used: {this.state.expense.currency.name}</Text>
                    <Text> </Text>
                    <Text style={standardStyles.textCenter}> - - - </Text>
                    <Text> </Text>

                    <ScrollView style={{marginBottom: 10}}>
                        <View>{this.state.balances.length > 0 ? this.state.balances : <Text>Calculating</Text>}</View>
                    </ScrollView>
                </View>

                {image &&
                    <View style={standardStyles.flex}>
                        <Image source={{ uri: image }} style={{ flex: 1, width: width - 40, height: height * 0.2, resizeMode: 'contain' }} />
                    </View>}

                <View style={[standardStyles.rowContainer, { marginTop: 10 }]}>
                    <View style={standardStyles.flex}>
                        <GreenButton buttonStyle={specificStyles.leftButton} buttonText={'BACK'} onPress={() => this.returnToFeed(goBack, dispatch)} />
                    </View>
                    <View style={standardStyles.flex}>
                        <GreenButton buttonStyle={specificStyles.rightButton} buttonText={'DELETE'} onPress={() => confirmDelete('expense', () => this.deleteExpense(dispatch))} />
                    </View>
                </View>

            </View>
        );
    }

    returnToFeed(goBack: any, dispatch: any) {
        if (this.state.updatedConversion) {
            if (this.state.expenseArrayId === 'expenses') {
                resetState('ExpenseFeed', dispatch);
            } else {
                resetGroupState(this.state.group, this.state.expenseArray, dispatch);
            }
        } else {
            goBack();
        }
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
                    this.setState({ expense, expenseArray, updatedConversion: true }, () => {
                        AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
                        this.createBalances(expense, base, data.rates[current], true);
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
            let name = (balance.person.lastname !== '') ? balance.person.firstname + ' ' + balance.person.lastname : balance.person.firstname;
            let conversion = (needConversion) ? '(=' + defaultCurrency.symbol + Math.abs((balance.amount / rate)).toFixed(2) + ')' : '';
            if (balance.amount > 0) {
                text.push(
                    <Text key={index}>
                        {name} paid {expense.currency.symbol}{balance.amount.toFixed(2)} {conversion}
                    </Text>
                );
            } else {
                text.push(
                    <Text key={index}>
                        {name} owes {expense.currency.symbol}{(balance.amount * -1).toFixed(2)} {conversion}
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