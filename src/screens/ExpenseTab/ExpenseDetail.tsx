import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import { currencies } from '../../config/Data';

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
                <StatusBar hidden={true} />
                <View>{this.state.balances.length > 0 ? this.state.balances : <Text>Calculating</Text>}</View>
                <Text>{this.state.expense.amount}</Text>
                <Text>{this.state.expense.currency}</Text>
                <Text>{this.state.expense.date}</Text>
            </ScrollView>
        );
    }

    componentWillMount() {
        let text = [] as ReactNode[];
        this.state.expense.balances.map((balance: Balance, index: number) => {
            if (balance.amount > 0) {
                text.push(<Text key={index}>{balance.person.firstname} {balance.person.lastname} payed {currencies[this.state.expense.currency.tag].symbol}{balance.amount}</Text>);
            } else {
                text.push(<Text key={index}>{balance.person.firstname} {balance.person.lastname} has to pay {currencies[this.state.expense.currency.tag].symbol}{balance.amount * -1}</Text>);
            }
        });
        this.setState({ balances: text });
    }
}

export default ExpenseDetail;
