import React from 'react';
import { View, Text } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textStyles } from './styles';

const InputWithLabel = (props: IPropsWithLabel) => {
    return (
        <View>
            <Text>{props.labelText}</Text>
            <InputWithoutLabel
                placeholder={props.placeholder}
                returnKeyType={props.returnKeyType}
                keyboardType={props.keyboardType}
                autoCapitalize={props.autoCapitalize}
                autoCorrect={props.autoCorrect}
                secureTextEntry={props.secureTextEntry}
                onSubmitEditing={props.onSubmitEditing}
            />
        </View>
    );
};

export { InputWithLabel }