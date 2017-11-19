import React from 'react';
import { View, Text, TouchableHighlight, TextInput, TextInputProperties } from 'react-native';
import { textInputStyles } from './styles';

const InputWithoutLabel = (props: IProps) => {
    return (
        <View>
            <TextInput
                style={textInputStyles.input}
                underlineColorAndroid={'transparent'}
                {...props}
            />
        </View>
    );
};

export { InputWithoutLabel }