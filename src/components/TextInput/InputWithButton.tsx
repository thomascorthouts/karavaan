import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textInputStyles } from './styles';

export class InputWithButton extends React.Component<IPropsWithButton, {}> {
    constructor(props: IPropsWithButton) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten([textInputStyles.label]);

        return (
            <View>
                <TouchableHighlight onPress={this.props.selectCurrency}>
                    <Text style={combinedStyle}>{this.props.buttonText}</Text>
                </TouchableHighlight>
                <InputWithoutLabel
                    {...this.props}
                    value = {this.props.value}
                    keyboardType={'numeric'}
                />
            </View>
        );
    }
}