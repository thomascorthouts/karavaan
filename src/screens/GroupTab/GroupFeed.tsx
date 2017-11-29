import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, AsyncStorage } from 'react-native';
import { GroupItem } from '../../components/GroupFeedItem';

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

        let groupArray;
        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.groupArray) {
            console.log('navigation props');
            groupArray = this.props.navigation.state.params.groupArray;
        } else {
            groupArray = this.state.groupArray || [];
        }

        let groups = groupArray.map((val: any, key: any) => {
            return <GroupItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key)} />;
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {groups}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddGroup')} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    viewDetails(key: number) {
        this.state.groupArray.splice(key, 1);
        this.setState({ groupArray: this.state.groupArray });
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