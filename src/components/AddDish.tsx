import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {InputWithLabel} from './TextInput/InputWithLabel';
import PersonPicker from './Pickers/PersonPicker';
import {ErrorText} from './Text/ErrorText';
import {GreenButton} from './Buttons/GreenButton';

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
    error: string;
}

export default class AddDish extends Component<IDefaultNavProps, IState> {

    constructor (props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            options: this.props.navigation.state.params as Options,
            description: ' ',
            amount: 0,
            users: [],
            item: {} as Dish,
            error: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Add Item</Text>
                <ErrorText errorText={this.state.error}/>
                <View>
                    <InputWithLabel labelText={'description'} value={ this.state.description } onChangeText={(description: string) => this.setState({description}) } />
                    <InputWithLabel labelText={'amount'} value={ this.state.amount.toString() } onChangeText={ (amount: string) =>  this.setState({amount: parseFloat(amount)}) } />
                    <PersonPicker persons={this.state.options.persons} choose={this.choose.bind(this)}/>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }}  onPress={() => this.save(goBack)} buttonText={'ADD'}/>
                    </View>
                </View>
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
        if (this.state.amount === 0 ) this.setState({ error: 'There is no amount chosen.' });
        else if (this.state.users.length === 0 ) this.setState({ error: 'There are no users selected.' });
        else {
            let item = Object.assign({}, this.state.item, {id: this.state.description + '#' + new Date().toISOString(), name: this.state.description, amount: this.state.amount, users: this.state.users});
            this.props.navigation.state.params.addItem(item);
            goBack();
        }
    }

}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputAmount: {
        flex: 3.6
    }
});