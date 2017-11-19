import React from 'react';
import { View, Text } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textInputStyles } from './styles';

const InputWithLabel = (props: IPropsWithLabel) => {
    return (
        <View>
            <Text>{props.labelText}</Text>
            <InputWithoutLabel
                {...props}
            />
        </View>
    );
};

export { InputWithLabel }