import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InputWithoutLabel } from './TextInput/InputWithoutLabel';
import {parseMoney} from '../utils/parsemoney';

interface IProps {
    keyval: any;
    val: string;
    amount: number;
    onChangeText(amount: number, id: string): any;
}

interface IState {
    amount: string;
}

export default class BillSplitterItem extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            amount: this.props.amount.toString()
        };
    }

    render() {
        return (
            <View key={this.props.keyval} style={styles.item}>
                <View>
                    <Text style={styles.detailText}>{this.props.val}</Text>
                </View>
                <View style={styles.expense}>
                    <InputWithoutLabel
                        inputStyle={{ width: 55 }}
                        value={this.state.amount.toString()}
                        onChangeText={(text: any) => {
                            this.update( text, this.props.keyval);
                        }}
                    />
                </View>
            </View>
        );
    }

    update (value: string, id: string) {
        let amount = parseMoney(value);
        this.setState({ amount });
        this.props.onChangeText(parseFloat(amount) , id);
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
        borderLeftColor: '#4B9382'
    },
    detailTextSmall: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        fontSize: 12
    },
    expense: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 20,
        bottom: 10,
        right: 10
    }
});