import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';

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

interface FriendList extends Array<string> { }

class AmountSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group as Group,
            options: this.props.navigation.state.params.opts as Options
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let persons = this.state.group.personArray || ['mathias', 'thomas', 'serhat'];
        const average = (this.state.options.splitMode) ? this.state.options.amount / persons.length : 0;
        let mod = this.state.options.amount - (average * persons.length);

        let splitter = persons.map((val: any, key: any) => {
            return <BillSplitterItem key={key} keyval={key} val={val} amount={average} submitEditing={() => this.submitEditing()}/>;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <Text>{this.state.options.description}</Text>
                <ScrollView style={styles.ScrollContainer}>
                    {splitter}
                </ScrollView>
                <Text>{mod}</Text>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.confirm(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    submitEditing() {
        console.log('hello');
    }

    confirm(navigation: any) {
        console.log('hello');
    }
    // TODO
    splitEven(users: Array<string>, amount: number) {
        let amounts = {} as any;
        const share = amount / users.length;
        for (let user in users) {
            amounts[user] = share;
        }
        return amounts;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    addButton: {
        backgroundColor: '#287E6F',
        width: 90,
        height: 90,
        borderRadius: 50,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        zIndex: 10
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 24
    }
});

export default AmountSplit;