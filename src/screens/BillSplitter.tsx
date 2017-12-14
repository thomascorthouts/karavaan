import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native';
import BillSplitterItem from '../components/BillSplitterItem';

interface IProps {
    navigation: any;
    group: Group;
};

interface IState {

};

interface FriendList extends Array<string> { }

class BillSplitter extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {

        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let persons = ['mathias', 'thomas', 'serhat'];

        let splitter = persons.map((val: any, key: any) => {
            return <BillSplitterItem key={key} keyval={key} val={val} amount={0} submitEditing={() => this.submitEditing()}/>;
        });

        return (
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle='light-content' />
                <ScrollView style={styles.ScrollContainer}>
                    {splitter}
                </ScrollView>
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

export default BillSplitter;
