import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    keyval: any;
    transaction: Transaction;
    currencySymbol: string;
    rate?: number;
}

interface Transaction {
    from: Person;
    to: Person;
    amount: number;
}

export class TransactionFeedItem extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <View key={this.props.keyval} style={styles.item} >
                <View>
                    <Text style={styles.detailText}>{this.props.transaction.from.firstname} {this.props.transaction.from.lastname}</Text>
                    <Text style={styles.detailText}>⇨ {this.props.transaction.to.firstname} {this.props.transaction.to.lastname}</Text>
                </View>
                <View style={styles.expense}>
                    <Text>{this.props.currencySymbol} {(this.props.rate) ? (this.props.rate * this.props.transaction.amount).toFixed(2) : this.props.transaction.amount.toFixed(2)}</Text>
                </View>
            </View>
        );
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