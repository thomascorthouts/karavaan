import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import {currencies} from '../../config/Data';

interface IState {
    expense: Expense;
    balances: ReactNode[];
}

class ExpenseDetail extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            expense: this.props.navigation.state.params.expense,
            balances: []
        };
    }

    render() {
        return (
            <ScrollView>
                <StatusBar hidden={true}/>
                <View> {this.state.balances} </View>
                <Text> {this.state.expense.amount} </Text>
                <Text> {this.state.expense.currency} </Text>
                <Text> {this.state.expense.date} </Text>
            </ScrollView>
        );
    }

    componentWillMount() {
        let text = [] as ReactNode[];
        this.state.expense.balances.map((balance: Balance, index: number) => {
            if (balance.amount > 0) text.push(<Text>{balance.person.firstname} {balance.person.lastname} payed {currencies[this.state.expense.currency].symbol}{balance.amount}</Text>);
            else text.push(<Text>{balance.person.firstname} {balance.person.lastname} has to pay {currencies[this.state.expense.currency].symbol}{balance.amount}</Text>);
        });
        this.setState({ balances: text });
    }
}

export default ExpenseDetail;
