import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar, Alert, AsyncStorage, NetInfo } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';

interface IState {
    key: number;
    expense: Expense;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    balances: ReactNode[];
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
            balances: []
        };
    }

    render() {
        return (
            <ScrollView>
                <StatusBar hidden={true} />
                <Text>Date: {this.state.expense.date}</Text>
                <View>{this.state.balances.length > 0 ? this.state.balances : <Text>Calculating</Text>}</View>
                <Text>Currency used: {this.state.expense.currency.name}</Text>
            </ScrollView>
        );
    }

    async getExchangeRate(date: string, base: Currency, current: string) {
        fetch('https://api.fixer.io/' + date + '?base=' + base.tag + '&symbols=' + current)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.rates) {
                    const expense = Object.assign({}, this.state.expense);
                    expense.currency.base = base.tag;
                    expense.currency.date = date;
                    expense.currency.rate = data.rates[current];
                    const expenseArray = [...this.state.expenseArray];
                    expenseArray[this.state.key] = expense;
                    this.setState({ expense, expenseArray }, () => {
                        AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
                        try {
                            this.props.navigation.state.params.updateFeedState({ expenseArray: this.state.expenseArray });
                        } catch (err) {
                            console.log(err);
                        }
                        this.createBalances(expense, base, data.rates[current], true);
                    });
                } else {
                    throw 'Mathias';
                }
            })
            .catch((error) => {
                console.log(error);
                this.showError('Failed to fetch exchange rates');
            });
    }

    showError(error: string) {
        Alert.alert('Warning', error.replace(/^[\n\r]+/, '').trim(),
            [
                { text: 'OK', onPress: () => { return false; } }
            ],
            { onDismiss: () => undefined }
        );
        return true;
    }

    calculateExchangeRate(defaultCurrency: Currency) {
        let expense = this.state.expense;
        const rate = expense.currency.rate;
        if (rate && expense.date === expense.currency.date && expense.currency.base === defaultCurrency.tag) {
            console.log("1");
            this.createBalances(expense, defaultCurrency, rate, true);
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    console.log("2");
                    this.getExchangeRate(expense.date, defaultCurrency, expense.currency.tag);
                } else {
                    console.log("3");
                    this.createBalances(expense, defaultCurrency, 0, false);
                }
            });
        }
    }

    createBalances(expense: Expense, defaultCurrency: Currency, rate: number, uptodate: boolean) {
        let text = [] as ReactNode[];
        let needConversion = expense.currency.tag !== defaultCurrency.tag && uptodate;

        this.state.expense.balances.map((balance: Balance, index: number) => {
            if (balance.amount > 0) {
                let conversion = (needConversion) ? '(=' + defaultCurrency.symbol + (balance.amount * rate).toFixed(3) + ')' : '';
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} payed {expense.currency.symbol}{balance.amount} {conversion}
                    </Text>
                );
            } else {
                let conversion = (needConversion) ? '(=' + defaultCurrency.symbol + (balance.amount * rate * -1).toFixed(3) + ')' : '';
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} has to pay {expense.currency.symbol}{balance.amount * -1} {conversion}
                    </Text>
                );
            }
        });
        this.setState({ balances: text });
    }

    componentWillMount() {
        AsyncStorage.getItem('defaultCurrency')
            .then((value) => {
                if (value) {
                    this.calculateExchangeRate(JSON.parse(value));
                }
            });
    }
}

export default ExpenseDetail;
