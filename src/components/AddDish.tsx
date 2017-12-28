import React, { Component } from 'react';
import { View, Button } from 'react-native';
import {InputWithLabel} from './TextInput/InputWithLabel';
import PersonPicker from './Pickers/PersonPicker';

interface Options {
    navigation: any;
    persons: PersonList;
}

interface IState {
    options: Options;
    description: string;
    amount: number;
    users: PersonList;
    item: Dish;
}

export default class AddDish extends Component<IDefaultNavProps, IState> {

    constructor (props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            options: this.props.navigation.state.params as Options,
            description: '',
            amount: 0,
            users: [],
            item: {} as Dish
        };
    }

    render() {
        const { goBack } = this.props.navigation;
        return(
            <View>
                    <InputWithLabel labelText={'description'} value={ this.state.description } onChangeText={(description: string) => this.setState({description}) } />
                    <InputWithLabel labelText={'amount'} value={ this.state.amount.toString() } onChangeText={ (amount: string) =>  this.setState({amount: parseFloat(amount)}) } />
                    <PersonPicker persons={this.state.options.persons} choose={this.choose.bind(this)}/>
                    <Button title={'Add Item'} onPress={() => this.save(goBack)}/>
            </View>
        );
    }

    choose(id: string) {
        let chosen = this.state.users;
        const p = this.state.options.persons.find((val: Person) => {return (val.id === id); });
        if (typeof p !== 'undefined') {
            chosen.push(p);
            this.setState({users: chosen});
        }
    }

    save(goBack: any) {
        let item = Object.assign({}, this.state.item, {name: this.state.description, amount: this.state.amount, users: this.state.users});
        this.props.navigation.state.params.addItem(item);
        goBack();
    }

}