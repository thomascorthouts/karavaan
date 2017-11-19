import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textInputStyles } from './styles';

const InputWithLabel = (props: IPropsWithLabel) => {
    const combinedStyle = StyleSheet.flatten([textInputStyles.label, props.labelStyle]);

    return (
        <View>
            <Text style={combinedStyle}>{props.labelText}</Text>
            <InputWithoutLabel
                {...props}
            />
        </View>
    );
};

export { InputWithLabel }