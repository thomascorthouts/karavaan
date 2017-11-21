
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, StatusBar } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { ExpenseItem } from '../../src/components/ExpenseItem';
import { users } from '../config/Data';
import { ColumnContainer } from '../components/Container/ColumnContainer';

class HomeScreen extends Component<IHomeProps, IHomeState> {
    state = {
        expenseArray: [] as ExpenseList
    };

    constructor(props: IHomeProps, state: IHomeState) {
        super(props, state);
    }

    render() {
        let expenses = this.state.expenseArray.map((val, key) => {
            return <ExpenseItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key)} />;
        });

        return (
            <ColumnContainer>
                <StatusBar translucent={false} barStyle='light-content' />
                <ScrollView style={styles.ScrollContainer}>
                    {expenses}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={this.addExpense.bind(this)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ColumnContainer>
        );
    }

    addExpense() {
        let user = users[this.state.expenseArray.length]
        let d = new Date();
        this.state.expenseArray.push({ 'date':  d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(), 'expense': user.expense, 'name': `${user.name.first} ${user.name.last}` });
        this.setState({ expenseArray: this.state.expenseArray });
    }

    viewDetails(key: number) {
        this.state.expenseArray.splice(key, 1);
        this.setState({ expenseArray: this.state.expenseArray });
    }

    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // }

    handleBackButton() {
        Alert.alert('Warning', 'Do you really want to close the application?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => BackHandler.exitApp() }
            ],
            { onDismiss: () => undefined }
        );
        return true;
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
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