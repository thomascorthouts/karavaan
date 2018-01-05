import React, { Component, ReactNode } from 'react';
import {
    Button, View, ScrollView, StyleSheet,
    AsyncStorage, Picker
} from 'react-native';
import { ExpenseItem } from '../../components/FeedItems/ExpenseFeedItem';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { _currencies } from '../../config/Data';
import { getRate } from '../../utils/getRate';

interface IState {
    person: string;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    personArray: PersonList;
    feed: ReactNode[];
    currencies: Currencies;
    persons: ReactNode[];
    defaultCurrency: Currency;
    currency: Currency;
}

export default class ExpensesPerPerson extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state, navigate } = navigation;
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
            person: 'All',
            expenseArray: navParams.expenseArray,
            expenseArrayId: navParams.expenseArrayId,
            feed: [],
            currencies: navParams.currencies,
            personArray: navParams.personArray,
            persons: [] as ReactNode[],
            defaultCurrency: navParams.defaultCurrency,
            currency: navParams.currency
        };
    }

    render() {
        let { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {this.state.feed}
                </ScrollView>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <Picker style={{ height: 40 }} selectedValue={this.state.person} onValueChange={(person: string) => this.onPersonChange(person)}>
                            <Picker.Item key={'All Persons'} value={'All'} label={'All Users'} />
                            {this.state.persons}
                        </Picker>
                    </View>
                    <View style={styles.flex}>
                        <CurrencyPicker currencies={this.state.currencies} onValueChange={(curr: Currency) => this.updateRate(curr)} selectedValue={this.state.currency} />
                    </View>
                </View>
            </View>
        );
    }

    onPersonChange(person: string) {
        this.setState({ person }, this.updateView);
    }

    updateState = (data: any) => {
        this.setState(data, () => this.updateView());
    }

    updateRate(curr: Currency) {
        this.setState({ currency: curr }, this.updateView);
    }

    updateView() {
        let { navigate } = this.props.navigation;
        let feed: ReactNode[] = [];
        this.state.expenseArray.map((val: Expense, key: any) => {
            let rate = (val.currency.tag === this.state.currency.tag) ? 1 : getRate(val.currency.tag, this.state.currency.tag, this.state.currencies);
            if (this.state.person !== 'All') {
                val.balances.map((bal: Balance) => {
                    if (bal.person.id === this.state.person) {
                        feed.push(<ExpenseItem key={key} keyval={key} rate={rate} currency={this.state.currency} val={val} viewDetails={() => this.viewDetails(key, navigate)} />);
                    }
                });
            } else {
                feed.push(<ExpenseItem key={key} keyval={key} rate={rate} currency={this.state.currency} val={val} viewDetails={() => this.viewDetails(key, navigate)} />);
            }
        });
        this.setState({ feed });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenseArray[key];
        let screen = ('group' in this.props.navigation.state.params) ? 'GroupExpenseDetail' : 'ExpenseDetail';
        navigate(screen, { expense: expense, expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState });
    }

    componentWillMount() {
        let expenses = [...this.state.expenseArray];
        let personArray = this.state.personArray;

        // Expenses is now sorted by date
        expenses = expenses.sort((exp1: Expense, exp2: Expense) => {
            let a = exp1.date;
            let b = exp2.date;
            a = a.split('-').join('');
            b = b.split('-').join('');
            return a > b ? 1 : a < b ? -1 : 0;
        });

        let persons = this.state.persons;
        if (personArray) {
            persons = personArray.map((val: Person) => {
                return <Picker.Item key={val.id} value={val.id} label={val.firstname + ' ' + val.lastname} />;
            });
        }

        this.setState({ persons, expenseArray: expenses }, this.updateView);
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