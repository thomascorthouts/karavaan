import React, { Component } from 'react';
import { View, ScrollView, Button, AsyncStorage, StyleSheet } from 'react-native';
import { currencies } from '../../config/Data';
import { BalanceFeedItem } from '../../components/BalanceFeedItem';
import { getRate } from '../../utils/getRate';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';

interface IState {
    group: Group;
    currency: Currency;
    currencies: Currencies;
    balances: Balances;
    rate: number;
    expenseArrayId: string;
}
export default class BalancesSummary extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = (typeof state.params.group.name !== 'undefined') ? state.params.group.name : 'Summaries';
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', { group: state.params.group, groupArray: state.params.groupArray, update: true })
            }/>;
            return {
                headerTitle: `${title}`,
                headerRight: headerRight
            };
        } else {
            return {};
        }
    };

    // This is initially programmed for a group
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        let bool = Object.keys(navParams.group).length !== 0;
        this.state = {
            group: bool ? navParams.group : {} as Group,
            currencies: currencies,
            currency: bool ? navParams.group.defaultCurrency : {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            },
            balances: [] as Balances,
            rate: 1,
            expenseArrayId: bool ? 'expenses-' + navParams.group.id : 'expenses'
        };
    }

    render() {
        let balanceItems = this.state.balances.map((val: Balance) => {
            return <BalanceFeedItem keyval={val.person.id} currencySymbol={this.state.currency.symbol} person={val.person} rate={this.state.rate} balance={val.amount} key={val.person.id} />;
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {balanceItems}
                </ScrollView>
                <View style={styles.rowContainer}>
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

    componentDidMount() {
        let currencies = {};
        AsyncStorage.getItem('currencies')
            .then((value: string) => {
                if (value) currencies = JSON.parse(value).rates;
        });
        let balances: Balances = [];
        let rate = 1;

        AsyncStorage.getItem(this.state.expenseArrayId)
            .then((value: string) => {
                let expenses = JSON.parse(value);
                if (expenses) {
                    expenses.map((val: Expense) => {
                        val.balances.map((bal: Balance) => {
                            let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                            // Test whether this works
                            rate = (val.currency.tag === this.state.currency.tag) ? 1 : getRate(val.currency.tag, this.state.currency.tag, currencies);
                            bal.amount = bal.amount * rate;
                            bal.amount = (bal.amount > 0) ? Math.floor( bal.amount * Math.pow(10, 2) ) / Math.pow(10, 2) : Math.ceil( bal.amount * Math.pow(10, 2) ) / Math.pow(10, 2);

                            if (typeof balFound !== 'undefined') balFound.amount += bal.amount;
                            else balances.push(bal);
                        });
                    });
                    this.setState({ balances });
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