import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buttonStyles } from './styles';

export class DeleteButton extends React.Component<IPropsDeleteButton, {}> {

    constructor(props: IPropsDeleteButton) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten([buttonStyles.greenButtonContainer, this.props.buttonStyle]);

        return (
            <TouchableOpacity style={combinedStyle}
                {...this.props}
            >
                <Text style={buttonStyles.redButtonText}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        );
    }
}