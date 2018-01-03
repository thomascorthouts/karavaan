import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface IProps {
    keyval: any;
    val: Expense;
    currency?: Currency;
    viewDetails(): void;
}

export class ExpenseItem extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        let amount;
        if (this.props.currency && this.props.currency.rate) {
            amount = this.props.currency.symbol + (this.props.currency.rate * this.props.val.amount).toFixed(2);
        } else {
            amount = this.props.val.currency.symbol + (this.props.val.amount).toFixed(2);
        }

        if (this.props.val.isTransaction) {
            return (
                <View key={this.props.keyval}>
                    <TouchableOpacity style={styles.item} onPress={this.props.viewDetails}>
                        <View>
                            <Text
                                style={styles.detailText}>{this.props.val.balances[1].person.firstname} {this.props.val.balances[1].person.lastname}</Text>
                            <Text
                                style={styles.detailText}>⇨ {this.props.val.balances[0].person.firstname} {this.props.val.balances[0].person.lastname}</Text>
                            <Text
                                style={styles.detailTextSmall}>{this.props.val.category} - {this.props.val.description}</Text>
                        </View>
                        <View style={styles.expense}>
                            <Text>{amount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View key={this.props.keyval}>
                    <TouchableOpacity style={styles.item} onPress={this.props.viewDetails}>
                        <View>
                            <Text
                                style={styles.detailText}>{this.props.val.description}</Text>
                            <Text
                                style={styles.detailTextSmall}>{this.props.val.category}</Text>
                        </View>
                        <View style={styles.expense}>
                            <Text>{amount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111'
    },
    detailText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        flexWrap: 'wrap'
    },
    detailTextSmall: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        fontSize: 12,
        flexWrap: 'wrap'
    },
    expense: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    }
});