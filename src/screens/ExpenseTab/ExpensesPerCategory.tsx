import React, { Component, ReactNode } from 'react';
import { View, ScrollView, Text, StyleSheet, AsyncStorage, KeyboardAvoidingView, TouchableOpacity, Button, Picker } from 'react-native';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { ExpenseItem } from '../../components/ExpenseFeedItem';
import { GreenButton } from '../../components/Buttons/GreenButton';

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
            const headerRight = <Button title={'Edit'} onPress={() =>
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
        this.state = {
            category: 'All',
            group: navParams ? navParams.group : {} as Group,
            expenses: {} as ExpenseMap,
            feed: [],
            expenseArray: [] as ExpenseList,
            expenseArrayId: navParams ? 'expenses-' + navParams.group.id : 'expenses'
        };
    }

    render() {
        let { navigate } = this.props.navigation;
        let otherPickerOptions = [<Picker.Item label={'All'} value={'All'} key={'all'} />];
        return (
            <View style={styles.flex}>
                <CategoryPicker
                    selectedValue={this.state.category}
                    onValueChange={(category: string) => this.setState({ category }, () => this.updateView())}
                    otherOptions={otherPickerOptions}
                />
                <ScrollView style={styles.flex}>
                    {this.state.feed}
                </ScrollView>
                
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginHorizontal: 2 }} buttonText={'Summaries'} onPress={() => navigate('GroupSummaries', { group: this.state.group, expenseArray: this.state.expenseArray})} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginHorizontal: 2 }} onPress={() => this.addExpense(navigate)} buttonText={'Add Expense'} />
                    </View>
                </View>
            </View>
        );
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    addExpense(navigate: any) {
        let screen = this.state.expenseArrayId === 'expenses' ? 'AddExpense' : 'GroupAddExpense';
        navigate(screen, {expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState, group: this.state.group });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenseArray[key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, {key: key, group: this.state.group, expense: expense, expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState});
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

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: -7
    }
});