import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InputWithoutLabel } from './TextInput/InputWithoutLabel';

interface IProps {
    keyval: any;
    val: string;
    amount: number;
    submitEditing(): any;
    onChangeText(amount: number, id: string): any;
}

interface IState {
    amount: number;
}

export default class BillSplitterItem extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            amount: this.props.amount
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
                        onSubmitEditing={this.props.submitEditing()}
                        value={this.state.amount.toString()}
                        onChangeText={(text: any) => {
                            this.update( parseFloat(text), this.props.keyval);
                        }}
                    />
                </View>
            </View>
        );
    }

    update ( amount: number, id: string) {
        if (isNaN(amount)) amount = 0;
        this.setState({amount});
        this.props.onChangeText(amount, id);
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