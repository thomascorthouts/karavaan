import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textInputStyles } from './styles';

export class InputWithLabel extends React.Component<IPropsWithLabel, {}> {
    constructor(props: IPropsWithLabel) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten([textInputStyles.label, this.props.labelStyle]);

        return (
            <View>
                <Text style={combinedStyle}>{this.props.labelText}</Text>
                <InputWithoutLabel
                {...this.props}
                />
            </View>
        );
    }
}