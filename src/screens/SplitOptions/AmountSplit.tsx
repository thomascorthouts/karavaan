import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
import BillSplitterItem from '../../components/BillSplitterItem';
import OptionPicker from '../../components/Pickers/OptionPicker';

interface Options {
    splitMode: boolean;
    currency: string;
    amount: number;
    description: string;
}

interface IProps {
    navigation: any;
};

interface Amount {
    person: Person;
    amount: number;
}
interface IState {
    group: Group;
    options: Options;
    amounts: Array<Amount>;
    sum: number;
    payers: Array<Amount>;
    personArray: PersonList;
};


class AmountSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group as Group,
            options: this.props.navigation.state.params.opts as Options,
            amounts: [],
            payers: [],
            sum: 0,
            personArray: [] as PersonList
        };
        this.countSum();
    }

    render() {
        const { navigate } = this.props.navigation;

        let splitter = this.state.amounts.map((val: Amount, key: number) => {
            return <BillSplitterItem key={key} keyval={key} val={val.person.firstname + ' ' + val.person.lastname} amount={val.amount} submitEditing={() => this.submitEditing()}/>;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <Text>{this.state.options.description}</Text>
                <ScrollView>
                    <Text>Here has to come the PersonPicker </Text>
                </ScrollView>
                <Text>Receivers</Text>
                <ScrollView style={styles.ScrollContainer}>
                    {splitter}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <Text>Total: {this.state.options.currency}{this.state.sum}</Text>
                    <TouchableOpacity onPress={() => this.confirm(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    countSum() {
        let sum = this.state.options.amount;
        this.state.amounts.map((val: Amount, index: number) => {
           sum -= val.amount;
        });
        this.setState({sum});
    }

    submitEditing() {
        console.log('hello');
    }

    confirm(navigation: any) {
        console.log('hello');
    }

    componentWillMount() {
        AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        personArray: JSON.parse(value)
                    });
                }
            });

        let amounts = [] as Amount[];
        const avg = (this.state.options.splitMode) ? (this.state.options.amount / this.state.personArray.length) : 0;
        this.state.personArray.map((val: Person, index: number) => {
            amounts.push({ person: val, amount: avg });
        });
        this.setState({amounts});
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