import React, { Component, ReactNode } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { InputWithLabel } from '../TextInput/InputWithLabel';

interface IProps {
    inputLabel: string;
    onChangeText: any;
    textInput: string;
    options: Array<ReactNode>;
    placeholder: string;
    scrollHeight: number;
    onFocus: any;
    onBlur: any;
}

export class OptionPicker extends Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        let height = Dimensions.get('window').height;

        return (
            <View>
                <InputWithLabel
                    labelText={this.props.inputLabel}
                    value={this.props.textInput}
                    onChangeText={this.props.onChangeText}
                    placeholder={this.props.placeholder}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                />
                <ScrollView
                    style={{ height: height * this.props.scrollHeight }}
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode='on-drag'
                >
                    {this.props.options}
                </ScrollView>
            </View>
        );
    }
}