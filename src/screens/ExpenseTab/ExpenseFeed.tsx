
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, StatusBar, AsyncStorage, Button } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { ExpenseItem } from '../../components/ExpenseFeedItem';

interface IState {
    [index: number]: Expense;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    group: Group;
}

class ExpenseFeed extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: {navigation: any}) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = state.params.group.name;
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', {group: state.params.group, groupArray: state.params.groupArray, update: true})
            }></Button>;
            return {
                headerTitle: `${title}`,
                headerRight: headerRight
            };
        } else {
            return {};
        }
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        this.state = {
            expenseArray: [] as ExpenseList,
            group: navParams ? navParams.group : {} as Group,
            expenseArrayId: navParams ? 'expenses-' + navParams.group.id : 'expenses'
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        let expenseArray = this.state.expenseArray || [];

        let expenses = expenseArray.map((val: any, key: any) => {
            return <ExpenseItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key, navigate)} />;
        });

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <ScrollView style={styles.ScrollContainer}>
                    {expenses}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.addExpense(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    addExpense(navigate: any) {
        let screen = this.state.expenseArrayId === 'expenses' ? 'AddExpense' : 'GroupAddExpense';
        navigate(screen, {expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState, group: this.state.group });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenseArray[key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, {key: key, group: this.state.group, expense: expense, expenseArray: this.state.expenseArray, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState});
    }

    componentDidMount() {
        AsyncStorage.getItem(this.state.expenseArrayId)
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        expenseArray: []
                    });
                }
            });
    }
}

export default ExpenseFeed;

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