import React, { Component, ReactNode } from 'react';
import { View, Picker } from 'react-native';

interface IProps {
    selectedValue: string;
    otherOptions?: ReactNode[];
    onValueChange: any;
}

interface IState {
    otherOptions: ReactNode[];
}

export class CategoryPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            otherOptions: (this.props.otherOptions) ? this.props.otherOptions : []
        };
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
                    {this.state.otherOptions}
                </Picker>
            </View>
        );
    }
}