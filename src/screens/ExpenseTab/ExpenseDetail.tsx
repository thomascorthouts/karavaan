import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar, Alert, AsyncStorage, NetInfo, StyleSheet } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetState, resetGroupState } from '../../utils/navigationactions';
import { NavigationActions } from 'react-navigation';

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
        const { dispatch } = this.props.navigation;

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

                <GreenButton buttonText={'DELETE'} onPress={() => this.confirmDelete('expense', () => this.deleteGroup(dispatch))} />
            </View>
        );
    }

    deleteGroup(dispatch: any) {
        this.state.expenseArray.splice(this.state.key, 1);

        this.deleteStorage()
            .then(() => {
                if (this.state.expenseArrayId === 'expenses') {
                    resetState('ExpenseFeed', dispatch);
                } else {
                    resetGroupState(this.state.group, this.state.expenseArray, dispatch);
                }
            });
    }

    async getExchangeRate(date: string, base: Currency, current: string) {
        console.log(this.state.failed);
        fetch('https://api.fixer.io/' + date + '?base=' + base.tag + '&symbols=' + current)
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
                        try {
                            this.props.navigation.state.params.updateFeedState({ expenseArray: this.state.expenseArray });
                        } catch (err) {
                            console.log(err);
                        }
                        this.createBalances(expense, base, data.rates[current], true);
                    });
                } else {
                    this.createBalances(expense, base, 0, false);
                    throw data.error;
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ failed: true });
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
            let conversion = (needConversion) ? '(=' + defaultCurrency.symbol + Math.abs((balance.amount * 1 / rate)).toFixed(2) + ')' : '';
            if (balance.amount > 0) {
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} payed {expense.currency.symbol}{balance.amount} {conversion}
                    </Text>
                );
            } else {
                text.push(
                    <Text key={index}>
                        {balance.person.firstname} {balance.person.lastname} has to pay {expense.currency.symbol}{balance.amount * -1} {conversion}
                    </Text>
                );
            }
        });
        this.setState({ balances: text });
    }

    async deleteStorage() {
        try {
            await AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            this.showError(error);
        }
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

    confirmDelete(type: string, callback: any) {
        Alert.alert('Warning', 'Do you really want to delete ' + type,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => callback() }
            ],
            { onDismiss: () => undefined }
        );
        return true;
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

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
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
    },
    inputAmount: {
        flex: 3.6
    }
});
