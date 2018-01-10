import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, StatusBar } from 'react-native';
import { GroupItem } from '../../components/FeedItems/GroupFeedItem';
import { GreenButton } from '../../components/Buttons/GreenButton';
import {specificStyles, standardStyles} from '../screenStyles';

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
            <View style={ standardStyles.flex }>
                <StatusBar hidden={true} />
                <ScrollView style={ standardStyles.flex }>
                    {groups}
                </ScrollView>

                <View style={ specificStyles.buttonContainer }>
                    <GreenButton onPress={() => this.addGroup(navigate)} buttonText='New Group' buttonStyle={{ marginBottom: 3, marginHorizontal: 2 }} />
                </View>
            </View>
        );
    }

    addGroup(navigate: any) {
        navigate('GroupForm', { groupArray: this.state.groupArray, update: false });
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
        navigate('GroupExpenseFeed', { group: group, expenseArray: expenseArray, groupArray: this.state.groupArray });
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