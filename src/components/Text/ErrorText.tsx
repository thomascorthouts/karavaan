import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { textStyles } from './styles';

export class ErrorText extends React.Component<IPropsTextError, {}> {
    constructor(props: IPropsTextError) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten([textStyles.errorText, this.props.errorStyle]);

        return (
            <Text style={combinedStyle}>{this.props.errorText}</Text>
        );
    }
}