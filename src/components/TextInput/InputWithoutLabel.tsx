import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { textInputStyles } from './styles';

export class InputWithoutLabel extends React.Component<ITextInputProps, {}> {
    constructor(props: ITextInputProps) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten([textInputStyles.input, this.props.inputStyle]);

        return (
            <View>
                <TextInput
                    style={combinedStyle}
                    underlineColorAndroid={'transparent'}
                    ref={this.props.inputref}
                    {...this.props}
                />
            </View>
        );
    }
}