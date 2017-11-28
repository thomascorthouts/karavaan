
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, StatusBar, AsyncStorage } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { ExpenseItem } from '../../components/ExpenseFeedItem';
import { users } from '../../config/Data';

class ExpenseFeed extends Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps, state: IHomeState) {
        super(props, state);

        this.state = {
            expenseArray: [] as ExpenseList
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let expenses = this.state.expenseArray.map((val, key) => {
            return <ExpenseItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key)} />;
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
        navigate('AddExpense');
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

    async addToStorage(value: string, key: string) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // TODO
        }
    }

    viewDetails(key: number) {
        this.state.expenseArray.splice(key, 1);
        this.setState({ expenseArray: this.state.expenseArray });
    }

    componentDidMount() {
        AsyncStorage.getItem('expenses')
            .then((value) => {
                if (value !== undefined) {
                    this.setState({
                        expenseArray: JSON.parse(value)
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