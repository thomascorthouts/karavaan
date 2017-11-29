
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, StatusBar, AsyncStorage } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { ExpenseItem } from '../../components/ExpenseFeedItem';
import { users } from '../../config/Data';

interface IState {
    [index: number]: Expense;
    expenseArray: ExpenseList;
}

class ExpenseFeed extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            expenseArray: [] as ExpenseList
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let expenseArray;
        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.expenseArray) {
            expenseArray = this.props.navigation.state.params.expenseArray;
        } else {
            expenseArray = this.state.expenseArray || [];
        }

        let expenses = expenseArray.map((val: any, key: any) => {
            return <ExpenseItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key, navigate)} />;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <ScrollView style={styles.ScrollContainer}>
                    {expenses}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.addExpense(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    addExpense(navigate: any) {
        navigate('AddExpense', {expenseArray: this.state.expenseArray});
    }

    /*
    addExpense() {
        let user = users[this.state.expenseArray.length];
        let d = new Date();
        this.state.expenseArray.push({ 'date': d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(), 'expense': user.expense, 'name': `${user.name.first} ${user.name.last}` });
        this.setState({ expenseArray: this.state.expenseArray });

        this.addToStorage(JSON.stringify(this.state.expenseArray), 'expenses');
    }
    */

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenseArray[key];
        navigate('ExpenseDetail', {expense: expense});
    }

    componentDidMount() {
        // AsyncStorage.removeItem('expenses');
        // AsyncStorage.removeItem('groups');

        AsyncStorage.getItem('expenses')
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        expenseArray: []
                    });
                }
            });
    }
}

export default ExpenseFeed;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
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