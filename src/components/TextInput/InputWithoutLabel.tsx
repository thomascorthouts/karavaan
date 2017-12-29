import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { textInputStyles } from './styles';

export class InputWithoutLabel extends React.Component<ITextInputProps, {}> {
    constructor(props: ITextInputProps) {
        super(props);
    }

    render() {
        const combinedStyle = StyleSheet.flatten(
            [this.props.editable === false ? textInputStyles.disabled : textInputStyles.input, this.props.inputStyle]
        );

        return (
            <View>
                <TextInput
                    style={combinedStyle}
                    underlineColorAndroid={'transparent'}
                    ref={this.props.inputref}
                    {...this.props}
                />
                {(this.props.suggestion !== undefined && this.props.suggestion !== '') &&
                    <TouchableOpacity style={textInputStyles.suggestionButton} onPress={this.props.suggestionPress}>
                        <Text style={textInputStyles.suggestionText}>{this.props.suggestion}</Text>
                    </TouchableOpacity>}
            </View>
        );
    }
}