import React, { Component, ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { InputWithLabel } from '../TextInput/InputWithLabel';

interface IProps {
    inputLabel: string;
    onChangeText: any;
    textInput: string;
    options: Array<ReactNode>;
}

class OptionPicker extends Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);

    }

    render() {

        return (
            <View>
                <InputWithLabel labelText={this.props.inputLabel} value={this.props.textInput} onChangeText={this.props.onChangeText}/>
                <ScrollView>
                    {this.props.options}
                </ScrollView>
            </View>
        );
    }
}

export default OptionPicker;