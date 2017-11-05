
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ExpenseItem } from '../../src/components/ExpenseItem';

export class HomeScreen extends Component<IHomeProps, IHomeState> {
    state = {
        expenseArray: [] as ExpenseList,
        expenseText: ''
    };

    constructor(props: IHomeProps, state: IHomeState) {
        super(props, state);
    }

    render() {
        let expenses = this.state.expenseArray.map((val, key) => {
            return <ExpenseItem key={key} keyval={key} val={val} deleteMethod={() => this.deleteExpense(key)} />;
        });
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headertext}>Karavaan</Text>
                </View>
                <ScrollView style={styles.ScrollContainer}>
                    {expenses}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={this.addExpense.bind(this)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                    <TextInput style={styles.textinput} onChangeText={(expenseText) => this.setState({ expenseText })}
                        value={this.state.expenseText}
                        underlineColorAndroid={'transparent'}
                        placeholder='> New Expense'>
                    </TextInput>
                </KeyboardAvoidingView>
            </View>
        );
    }
    addExpense() {
        if (this.state.expenseText) {
            let d = new Date();
            this.state.expenseArray.push({ 'date': d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(), 'expense': this.state.expenseText });
            this.setState({ expenseArray: this.state.expenseArray });
            this.setState({ 'expenseText': '' });
        }
    }
    deleteExpense(key: number) {
        this.state.expenseArray.splice(key, 1);
        this.setState({ expenseArray: this.state.expenseArray });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#287E6F',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FFF'
    },
    headertext: {
        color: '#FFF',
        fontSize: 20,
        padding: 20
    },
    ScrollContainer: {
        flex: 1,
        marginBottom: 100
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
        marginBottom: -65,
        zIndex: 10
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 24
    },
    textinput: {
        alignSelf: 'stretch',
        color: '#FFF',
        padding: 15,
        paddingTop: 56,
        paddingBottom: 0,
        backgroundColor: '#252525',
        borderTopWidth: 22,
        borderTopColor: '#EDEDED'
    }
});
