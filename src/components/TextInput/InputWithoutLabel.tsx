import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { textInputStyles } from './styles';

const InputWithoutLabel = (props: IProps) => {
    const combinedStyle = StyleSheet.flatten([textInputStyles.input, props.inputStyle]);

    return (
        <View>
            <TextInput
                style={combinedStyle}
                underlineColorAndroid={'transparent'}
                {...props}
            />
        </View>
    );
};

export { InputWithoutLabel }