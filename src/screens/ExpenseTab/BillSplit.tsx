import React, { Component } from 'react';
import { View, Button, AsyncStorage, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {InputWithLabel} from '../../components/TextInput/InputWithLabel';
import {InputWithCurrencySelector} from '../../components/TextInput/InputWithCurrencySelector';
import {currencies} from '../../config/Data';

interface IProps {
    navigation: any;
    group: Group;
};

interface IState {

};

class BillSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>

            </View>
        );
    }


}

export default BillSplit;
