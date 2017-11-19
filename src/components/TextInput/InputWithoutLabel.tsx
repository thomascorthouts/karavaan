import React from 'react';
import { View, Text, TouchableHighlight, TextInput, TextInputProperties } from 'react-native';
import { textStyles } from './styles';

const InputWithoutLabel = (props: IProps) => {
    return (
        <View>
            <TextInput
                style={textStyles.input}
                underlineColorAndroid={'transparent'}
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

export { InputWithoutLabel }