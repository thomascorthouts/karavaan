import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';

interface IState {
    expense: Expense;
}

class ExpenseDetail extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            expense: this.props.navigation.state.params.expense
        };
    }

    render() {
        return (
            <ScrollView>
                <Text> {this.state.expense.firstname} </Text>
                <Text> {this.state.expense.lastname} </Text>
                <Text> {this.state.expense.amount} </Text>
                <Text> {this.state.expense.currency} </Text>
                <Text> {this.state.expense.date} </Text>
            </ScrollView>
        );
    }
}

export default ExpenseDetail;
