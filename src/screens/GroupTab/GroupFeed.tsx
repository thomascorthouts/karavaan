import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, AsyncStorage, StatusBar } from 'react-native';
import { GroupItem } from '../../components/FeedItems/GroupFeedItem';

interface IProps {
    navigation: any;
    groupArray: GroupList;
}

interface IState {
    [index: number]: Group;
    groupArray: GroupList;
}

class Groups extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            groupArray: [] as GroupList
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let groupArray = this.state.groupArray || [];

        let groups = groupArray.map((group: Group, key: any) => {
            return <GroupItem key={key} keyval={key} val={group} viewDetails={() => this.viewExpenses(group, navigate)} />;
        });

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <ScrollView style={styles.ScrollContainer}>
                    {groups}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.addGroup(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    addGroup(navigate: any) {
        navigate('GroupForm', { groupArray: this.state.groupArray, updateFeedState: this.updateState, update: false});
    }

    async viewExpenses(group: Group, navigate: any) {
        let expenseArray = await AsyncStorage.getItem('expenses-' + group.id)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return [];
                }
            });
        navigate('GroupExpenseFeed', { group: group, expenseArray: expenseArray, groupArray: this.state.groupArray});
    }

    componentDidMount() {
        AsyncStorage.getItem('groups')
            .then((value) => {
                if (value) {
                    this.setState({
                        groupArray: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        groupArray: []
                    });
                }
            });
    }
}

export default Groups;

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