import React, { Component } from 'react';
import { View, Picker } from 'react-native';

interface IProps {
    selectedValue: string;
    onValueChange(cat: string): any;
}

interface IState {
    category: string;
}

export class CategoryPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            category: this.props.selectedValue
        };
    }

    render() {

        return (
            <View>
                <Picker onValueChange={(category: string) => {
                    this.setState({category});
                    this.onValueChange();
                }} selectedValue={this.state.category}>
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

    onValueChange() {
        this.props.onValueChange(this.state.category);
    }
}