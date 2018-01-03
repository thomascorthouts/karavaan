import React, { Component } from 'react';
import { View, ScrollView, Button, AsyncStorage, StyleSheet, ActivityIndicator } from 'react-native';
import { _currencies } from '../../config/Data';
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
        const { state, navigate } = navigation;
        if (state.params && 'group' in state.params) {
            const title = state.params.group.name;
            return {
                headerTitle: `${title}`
            };
        } else {
            return {};
        }
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
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
            return <BalanceFeedItem keyval={val.person.id} currencySymbol={this.state.currency.symbol} person={val.person} rate={this.state.currency.rate} balance={val.amount} key={val.person.id} />;
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

    async componentWillMount() {
        let expenses = this.state.expenseArray;
        let balances = [] as Balances;
        if (expenses) {
            expenses.map((val: Expense) => {
                val.balances.map((bal: Balance) => {
                    let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                    // Test whether this works
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
    flexCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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