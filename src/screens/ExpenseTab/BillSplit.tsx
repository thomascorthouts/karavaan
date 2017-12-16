import React, { Component } from 'react';
import { View, Button, AsyncStorage, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {currencies} from '../../config/Data';

interface Options {
    splitMode: boolean;
    currency: string;
    amount: number;
    description: string;
}

interface IProps {
    navigation: any;
};

interface IState {
    group: Group;
    options: Options;
};

class BillSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group as Group,
            options: this.props.navigation.state.params.opts as Options
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Button title={'Add Item'} onPress={ () => this.addItem()}/>
            </View>
        );
    }

    addItem () {
        // TODO
        const test = 1;
    }
}

export default BillSplit;
