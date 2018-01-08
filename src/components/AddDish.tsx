import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { InputWithLabel } from './TextInput/InputWithLabel';
import PersonPicker from './Pickers/PersonPicker';
import { ErrorText } from './Text/ErrorText';
import { GreenButton } from './Buttons/GreenButton';

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
    all: boolean;
    receivers: Array<ReactNode>;
}

export default class AddDish extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            options: this.props.navigation.state.params as Options,
            description: ' ',
            amount: 0,
            users: [],
            item: {} as Dish,
            error: '',
            all: false,
            receivers: []
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Add Item</Text>
                <ErrorText errorText={this.state.error} />
                <View style={styles.flex}>
                    <InputWithLabel
                        labelText={'description'}
                        value={this.state.description}
                        onChangeText={(description: string) => this.setState({ description })}
                    />
                    <InputWithLabel
                        labelText={'amount'}
                        value={this.state.amount.toString()}
                        onChangeText={(amount: string) => this.setState({ amount: parseFloat(amount) })}
                    />
                    <View style={{ flex: 0.13 }}>
                        <Text>Between who should the item be split?</Text>
                        <View style={styles.rowContainer}>
                            <Text>Split between all users</Text>
                            <Switch onTintColor={'#287E6F'} value={this.state.all} onValueChange={(all: boolean) => this.setState({ all })} />
                        </View>
                    </View>
                    <View style={styles.flex}>
                        <PersonPicker persons={this.state.options.persons} choose={this.choose.bind(this)} />
                        <Text>Selected users:</Text>
                        <ScrollView>
                            {this.state.receivers}
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} onPress={() => this.save(goBack)} buttonText={'ADD'} />
                    </View>
                </View>
            </View>
        );
    }

    choose(id: string) {
        let chosen = this.state.users;
        let receivers = this.state.receivers;
        const p = this.state.options.persons.find((val: Person) => { return (val.id === id); });
        if (typeof p !== 'undefined' && typeof this.state.users.find((val: Person) => { return (val.id === id); }) === 'undefined') {
            chosen.push(p);
            receivers.push(
                <View key={'receiver' + p.id} style={styles.rowContainer}>
                    <TouchableOpacity onPress={() => this.remove(p.id)}>
                        <Text>{p.firstname} {p.lastname}</Text>
                    </TouchableOpacity>
                </View>
            );
            this.setState({ users: chosen, receivers: receivers });
        }
    }

    remove(id: string) {
        let chosen = this.state.users;
        let receivers;
        chosen = chosen.filter((val: Person) => { return val.id !== id; });
        receivers = chosen.map((val: Person) => {
            return (
                <View key={'receiver' + val.id} style={styles.rowContainer}>
                    <TouchableOpacity onPress={() => this.remove(val.id)}>
                        <Text>{val.firstname} {val.lastname}</Text>
                    </TouchableOpacity>
                </View>
            );
        });
        this.setState({ users: chosen, receivers });
    }

    save(goBack: any) {
        if (this.state.amount === 0) this.setState({ error: 'There is no amount chosen.' });
        else if (!this.state.all && this.state.users.length === 0) this.setState({ error: 'There are no users selected.' });
        else {
            let item = Object.assign({}, this.state.item, {
                id: this.state.description + '#' + new Date().toISOString(),
                name: this.state.description,
                amount: this.state.amount,
                users: (this.state.all) ? this.state.options.persons : this.state.users
            });
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
        padding: 15,
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
    }
});