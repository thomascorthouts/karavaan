import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export class ExpenseItem extends React.Component<IExpenseProps, {}> {
    constructor(props: IExpenseProps) {
        super(props);
    }

    render() {
        return (
            <View key={this.props.keyval} style={styles.expense}>
                <Text style={styles.expenseText}>{this.props.val.date}</Text>
                <Text style={styles.expenseText}>{this.props.val.expense}</Text>
                <TouchableOpacity onPress={this.props.deleteMethod} style={styles.expenseDelete} >
                    <Text style={styles.expenseDeleteText}>D</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    expense: {
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#EDEDED'
    },
    expenseText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382'
    },
    expenseDelete: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2980B9',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    },
    expenseDeleteText: {
        color: '#FFF'
    }
});