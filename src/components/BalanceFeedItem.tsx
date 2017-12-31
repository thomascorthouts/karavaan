import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface IProps {
    keyval: any;
    currency: Currency;
    person: Person;
}

export class BalanceFeedItem extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <View key={this.props.keyval} style={styles.item} >
                    <View>
                        <Text style={styles.detailText}>{this.props.person.firstname} {this.props.person.lastname}</Text>
                    </View>
                    <View style={styles.expense}>
                        <Text>{this.props.currency.symbol} {this.props.person.balance}</Text>
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