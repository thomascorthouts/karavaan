import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';

interface IState {
    group: Group;
}

class GroupDetail extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: {navigation: any}) => ({
        headerTitle: `${navigation.state.params.group.name}`
    });

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <ScrollView>
                <Text> {this.state.group.name} </Text>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.viewExpenses(navigate)}>
                    <Text style={styles.buttonText}>View Expense</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    async viewExpenses(navigate: any) {
        let expenseArray = await AsyncStorage.getItem(this.state.group.expenseArrayId)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return [];
                }
            });
        navigate('GroupExpenseFeed', { expenseArray: expenseArray, expenseArrayId: this.state.group.expenseArrayId });
    }
}

export default GroupDetail;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#287E6F',
        paddingVertical: 15,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF'
    }
});