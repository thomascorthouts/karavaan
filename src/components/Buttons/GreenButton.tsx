import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonStyles } from './styles';

export class GreenButton extends React.Component<IPropsGreenButton, {}> {
    constructor(props: IPropsGreenButton) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={buttonStyles.greenButtonContainer}
                {...this.props}
            >
                <Text style={buttonStyles.whiteButtonText}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        );
    }
}