import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { BalanceFeedItem } from '../../components/FeedItems/BalanceFeedItem';
import { getRate } from '../../utils/getRate';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';

interface IState {
    defaultCurrency: Currency;
    currency: Currency;
    currencies: Currencies;
    balances: Balances;
    expenseArray: ExpenseList;
}

export default class BalancesSummary extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state } = navigation;
        if (state.params && 'group' in state.params) {
            return {
                headerTitle: `${state.params.group.name} Summaries`
            };
        } else {
            return {
                headerTitle: 'Expense Summaries'
            };
        }
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = JSON.parse(JSON.stringify(this.props.navigation.state.params));
        this.state = {
            currencies: navParams.currencies,
            defaultCurrency: navParams.defaultCurrency,
            currency: navParams.currency,
            balances: [] as Balances,
            expenseArray: navParams.expenseArray
        };
    }

    render() {
        let balanceItems = this.state.balances.map((val: Balance) => {
            return (
                <BalanceFeedItem
                    keyval={val.person.id}
                    currencySymbol={this.state.currency.symbol}
                    person={val.person}
                    rate={getRate(this.state.defaultCurrency.tag, this.state.currency.tag, this.state.currencies)}
                    balance={val.amount}
                    key={val.person.id}
                />
            );
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {balanceItems}
                </ScrollView>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <CurrencyPicker currencies={this.state.currencies} onValueChange={(curr: Currency) => this.updateRate(curr)} selectedValue={this.state.currency} />
                    </View>
                </View>
            </View>
        );
    }

    updateRate(curr: Currency) {
        this.setState({ currency: curr });
    }

    componentWillMount() {
        let expenses = this.state.expenseArray;
        let balances = [] as Balances;
        if (expenses) {
            expenses.map((val: Expense) => {
                val.balances.map((bal: Balance) => {
                    let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                    let rate = (val.currency.tag === this.state.currency.tag) ? 1 : getRate(val.currency.tag, this.state.currency.tag, this.state.currencies);
                    bal.amount = bal.amount * rate;
                    bal.amount = (bal.amount > 0) ? Math.floor(bal.amount * Math.pow(10, 2)) / Math.pow(10, 2) : Math.ceil(bal.amount * Math.pow(10, 2)) / Math.pow(10, 2);

                    if (typeof balFound !== 'undefined') balFound.amount += bal.amount;
                    else balances.push(bal);
                });
            });
        }

        this.setState({ balances });
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
        flexDirection: 'row',
        paddingTop: 3,
        borderTopWidth: 0.5,
        borderTopColor: '#111'
    }
});