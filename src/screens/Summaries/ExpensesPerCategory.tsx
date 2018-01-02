import React, { Component, ReactNode } from 'react';
import { View, ScrollView, Text, StyleSheet, AsyncStorage, KeyboardAvoidingView, TouchableOpacity, Button, Picker } from 'react-native';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { ExpenseItem } from '../../components/ExpenseFeedItem';

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

        this.state = {
            category: 'All',
            group: this.props.navigation.state.params.group,
            expenses: {} as ExpenseMap,
            feed: [],
            expenseArrayId: 'expenses-' + this.props.navigation.state.params.group.id,
            expenseArray: [] as ExpenseList
        };
    }

    render() {
        let { navigate } = this.props.navigation;
        let otherPickerOptions = [<Picker.Item label={'All'} value={'All'} key={'all'} />];
        return (
            <View style={styles.container}>
                <CategoryPicker selectedValue={this.state.category} onValueChange={this.onCategoryChange.bind(this)} otherOptions={otherPickerOptions} />
                <ScrollView style={styles.ScrollContainer}>
                    {this.state.feed}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.addExpense(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    addExpense(navigate: any) {
        let screen = 'GroupAddExpense';
        navigate(screen, { expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState, group: this.state.group });
    }

    onCategoryChange(category: string) {
        this.setState({ category }, this.updateView);
    }

    updateView() {
        let { navigate } = this.props.navigation;
        if (this.state.expenses[this.state.category] && this.state.expenses[this.state.category].length > 0) {
            let feed = this.state.expenses[this.state.category].map((val: Expense, key: any) => {
                return <ExpenseItem key={key} keyval={key} val={val}
                                    viewDetails={() => this.viewDetails(key, navigate)}/>;
            });

            this.setState({feed});
        }
        else this.setState({feed : []});
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenses[this.state.category][key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, { expense: expense });
    }

    componentDidMount() {
        let expenseArray: ExpenseList = [];
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    expenseArray = JSON.parse(value);
                    this.setState({ expenseArray });
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

                    this.setState({ expenses: expenseMap }, this.updateView);
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
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    currentMembers: {
        flex: 3
    },
    deleteButton: {
        height: 40,
        paddingVertical: 10
    },
    addButton: {
        backgroundColor: '#287E6F',
        width: 90,
        height: 90,
        borderRadius: 50,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        zIndex: 10
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 24
    }
});