import React, { Component, ReactNode } from 'react';
import { View, ScrollView, StyleSheet, AsyncStorage, Picker, Dimensions } from 'react-native';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { ExpenseItem } from '../../components/FeedItems/ExpenseFeedItem';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { _currencies } from '../../config/Data';
import {specificStyles, standardStyles} from '../screenStyles';

interface ExpenseMap {
    [index: string]: ExpenseList;
}

interface IState {
    category: string;
    group: Group;
    expenses: ExpenseMap;
    feed: ReactNode[];
    expenseArrayId: string;
    expenseArray: ExpenseList;
}

export default class ExpensesPerCategory extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = state.params.group.name;
            const width = Dimensions.get('window').width;
            const headerRight = <GreenButton buttonStyle={{ margin: 10, width: width * 0.2, borderRadius: 10 }} buttonText={'Edit'} onPress={() =>
                navigate('GroupForm', { group: state.params.group, groupArray: state.params.groupArray, update: true })
            } />;
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
        let bool = navParams && Object.keys(navParams.group).length !== 0;
        this.state = {
            category: 'All',
            group: bool ? navParams.group : {} as Group,
            expenses: {} as ExpenseMap,
            feed: [],
            expenseArray: [] as ExpenseList,
            expenseArrayId: bool ? 'expenses-' + navParams.group.id : 'expenses'
        };
    }

    render() {
        let { navigate } = this.props.navigation;
        let otherPickerOptions = [<Picker.Item label={'All Categories'} value={'All'} key={'all'} />];
        return (
            <View style={ standardStyles.flex }>
                <CategoryPicker
                    selectedValue={this.state.category}
                    onValueChange={(category: string) => this.setState({ category }, () => this.updateView())}
                    otherOptions={otherPickerOptions}
                />

                <ScrollView style={[ standardStyles.flex , { borderTopWidth: 0.5, borderTopColor: '#111' }]}>
                    {this.state.feed}
                </ScrollView>

                <View style={ [specificStyles.buttonContainer, standardStyles.rowContainer, { marginBottom: -7 }] }>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ [specificStyles.leftButton, { marginLeft: 2 }] } buttonText={'Summaries'} onPress={() => this.viewSummaries(navigate)} />
                    </View>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ [specificStyles.rightButton, { marginRight: 2 }] } onPress={() => this.addExpense(navigate)} buttonText={'Add Expense'} />
                    </View>
                </View>
            </View>
        );
    }

    addExpense(navigate: any) {
        let screen = this.state.expenseArrayId === 'expenses' ? 'AddExpense' : 'GroupAddExpense';
        navigate(screen, { expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, group: this.state.group });
    }

    async viewSummaries(navigate: any) {
        let currencies = await AsyncStorage.getItem('currencies')
            .then((value: string) => {
                if (value) {
                    return JSON.parse(value).rates;
                } else {
                    return _currencies;
                }
            });

        let personId = this.state.expenseArrayId === 'expenses' ? 'persons' : 'persons-' + this.state.group.id;
        let personArray = await AsyncStorage.getItem(personId)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return [];
                }
            });

        AsyncStorage.getItem('defaultCurrency').then((value) => {
            let currency = {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            };
            if (value) {
                currency = JSON.parse(value);
            }

            if (this.state.expenseArrayId === 'expenses') {
                navigate('ExpenseSummaries', {
                    currency: currency, defaultCurrency: currency, currencies: currencies, expenseArray: this.state.expenseArray,
                    expenseArrayId: this.state.expenseArrayId, personArray: personArray
                });
            } else {
                navigate('GroupSummaries', {
                    currency: this.state.group.defaultCurrency, defaultCurrency: this.state.group.defaultCurrency, currencies: this.state.group.currencies,
                    group: this.state.group, expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, personArray: personArray
                });
            }
        });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenseArray[key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, { key: key, group: this.state.group, expense: expense, expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId });
    }

    updateView() {
        let { navigate } = this.props.navigation;
        if (this.state.expenses[this.state.category] && this.state.expenses[this.state.category].length > 0) {
            let feed = this.state.expenses[this.state.category].map((val: Expense, key: any) => {
                return <ExpenseItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key, navigate)} />;
            });

            this.setState({ feed });
        } else {
            this.setState({ feed: [] });
        }
    }

    componentDidMount() {
        let expenseArray: ExpenseList = [];
        AsyncStorage.getItem(this.state.expenseArrayId)
            .then((value) => {
                if (value) {
                    expenseArray = JSON.parse(value);
                    let expenseMap: ExpenseMap = {
                        'All': expenseArray,
                        'Entertainment': [],
                        'Food & Drinks': [],
                        'Home': [],
                        'Life': [],
                        'Transport': [],
                        'Other': []
                    };

                    if (expenseArray.length > 0) expenseArray.map((expense: Expense) => {
                        expenseMap[expense.category].push(expense);
                    });

                    this.setState({ expenseArray, expenses: expenseMap }, this.updateView);
                }
            });
    }
}