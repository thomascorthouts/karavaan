import React, { Component, ReactNode } from 'react';
import {
    Button, View, ScrollView, StyleSheet,
    AsyncStorage, Picker
} from 'react-native';
import { ExpenseItem } from '../../components/ExpenseFeedItem';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { currencies } from '../../config/Data';
import { getRate } from '../../utils/getRate';

interface IState {
    person: string;
    group: Group;
    expenses: ExpenseList;
    feed: ReactNode[];
    expenseArrayId: string;
    personArrayId: string;
    persons: ReactNode[];
    currencies: Currencies;
    currency: Currency;
    rate: number;
}

export default class ExpensesPerPerson extends Component<IDefaultNavProps, IState> {

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

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        let bool = Object.keys(navParams.group).length !== 0;
        this.state = {
            person: 'All',
            group: this.props.navigation.state.params.group,
            expenses: [] as ExpenseList,
            feed: [],
            currencies: currencies,
            expenseArrayId: bool ? 'expenses-' + navParams.group.id : 'expenses',
            personArrayId: bool ? 'persons-' + navParams.group.id : 'persons',
            persons: [] as ReactNode[],
            currency: bool ? this.props.navigation.state.params.group.defaultCurrency : {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            },
            rate: 1
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
                        <Picker selectedValue={this.state.person} onValueChange={(person: string) => this.onPersonChange(person)}>
                            <Picker.Item key={'All'} value={'All'} label={'All Users'} />
                            {this.state.persons}
                        </Picker>
                    </View>
                    <View style={styles.flex}>
                        <CurrencyPicker currencies={this.state.currencies} onValueChange={(curr: Currency) => this.updateRate(curr)} selectedValue={this.state.currency}/>
                    </View>
                </View>
            </View>
        );
    }

    onPersonChange(person: string) {
        this.setState({ person }, this.updateView);
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    updateRate(curr: Currency) {
        this.setState({rate: getRate(this.state.group.defaultCurrency.tag, curr.tag, this.state.currencies), currency: curr});
    }

    updateView() {
        let { navigate } = this.props.navigation;
        let feed: ReactNode[] = [];
        this.state.expenses.map((val: Expense, key: any) => {
            if (this.state.person !== 'All') {
                val.balances.map((bal: Balance) => {
                    if (bal.person.id === this.state.person) {
                        feed.push(<ExpenseItem key={key} keyval={key} val={val}
                            viewDetails={() => this.viewDetails(key, navigate)} />);
                    }
                });
            } else {
                feed.push(<ExpenseItem key={key} keyval={key} val={val}
                    viewDetails={() => this.viewDetails(key, navigate)} />);
            }
        });
        this.setState({ feed });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenses[key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, { expense: expense });
    }

    componentDidMount() {
        AsyncStorage.getItem(this.state.expenseArrayId)
            .then((value) => {
                if (value) {
                    let expenses = JSON.parse(value);

                    expenses = expenses.sort((exp1: Expense, exp2: Expense) => {
                        let a = exp1.date;
                        let b = exp2.date;
                        a = a.split('-').join('');
                        b = b.split('-').join('');
                        return a > b ? 1 : a < b ? -1 : 0;
                    });
                    // Expenses is now sorted by date
                    this.setState({ expenses: expenses }, this.updateView);
                }
            });

        AsyncStorage.getItem(this.state.personArrayId)
            .then((value) => {
                if (value) {
                    let array = JSON.parse(value);
                    if (array) {
                        let persons = array.map((val: Person) => {
                            return <Picker.Item key={val.id} value={val.id} label={val.firstname + ' ' + val.lastname} />;
                        });

                        this.setState({ persons });
                    }
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