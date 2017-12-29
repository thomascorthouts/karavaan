import React, { Component, ReactNode } from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import { InputWithLabel } from '../TextInput/InputWithLabel';

interface IProps {
    inputLabel: string;
    onChangeText: any;
    textInput: string;
    options: Array<ReactNode>;
}

export class OptionPicker extends Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);

    }

    render() {

        let height = Dimensions.get('window').height;

        return (
            <View>
                <InputWithLabel labelText={this.props.inputLabel} value={this.props.textInput}
                                onChangeText={this.props.onChangeText}/>
                <ScrollView style={{
                    height: height * 0.2
                }}>
                    {this.props.options}
                </ScrollView>
            </View>
        );
    }
}