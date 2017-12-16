import React, { Component } from 'react';
import { View, Button, ScrollView } from 'react-native';
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
        let items;
        // TODO
        return (
            <View>
                <ScrollView >
                    {items}
                </ScrollView>
                <Button title={'Add Item'} onPress={ () => this.addItem()}/>
            </View>
        );
    }

    addItem () {
        // TODO
        const test = 1;
    }

    splitByBill(users: Array<string>, bill: Map<string, Dish>) {
        let amounts = {} as any;
        let amount;

        for (let user in users) {
            amounts[user] = 0;
        }

        bill.forEach((dish: Dish, name: string) => {
            amount = dish.amount / dish.users.length;
            for (let user in dish.users) {
                amounts[user] += amount;
            }
        });

        return amounts;
    }
}

export default BillSplit;
