import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { InputWithoutLabel } from './TextInput/InputWithoutLabel';

interface IProps {
    keyval: any;
    val: string;
    amount: number;
    submitEditing(): any;
    onChangeText(amount: number): any;
}

export default class BillSplitterItem extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
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
                        value={this.props.amount.toString()}
                        onChangeText={(text: any) => {
                            this.setState({amount: parseFloat(text)});
                            this.props.onChangeText(this.props.amount);
                        }}
                    />
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