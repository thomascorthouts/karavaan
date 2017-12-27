import React, { Component } from 'react';
import { View, Picker } from 'react-native';

interface IProps {
    onValueChange: any;
    selectedValue: any;
}

export class CategoryPicker extends Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {

        return (
            <View>
                <Picker onValueChange={this.props.onValueChange} selectedValue={this.props.selectedValue}>
                    <Picker.Item label={'Entertainment'} value={'Entertainment'} key={'entertainment'} />
                    <Picker.Item label={'Food & Drinks'} value={'Food & Drinks'} key={'food'} />
                    <Picker.Item label={'Home'} value={'Home'} key={'home'} />
                    <Picker.Item label={'Life'} value={'Life'} key={'life'} />
                    <Picker.Item label={'Transport'} value={'Transport'} key={'trans'} />
                    <Picker.Item label={'Other'} value={'Other'} key={'other'} />
                </Picker>
            </View>
        );
    }
}