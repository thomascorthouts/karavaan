import React, { Component, ReactNode } from 'react';
import {
    Button, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet,
    AsyncStorage, Picker
} from 'react-native';
import { ExpenseItem } from '../../components/ExpenseFeedItem';

interface IState {
    person: string;
    group: Group;
    expenses: ExpenseList;
    feed: ReactNode[];
    expenseArrayId: string;
    persons: ReactNode[];
}

export default class ExpensesPerPerson extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = state.params.group.name;
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', { group: state.params.group, groupArray: state.params.groupArray, update: true })
            }/>;
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

        this.state = {
            person: 'All',
            group: this.props.navigation.state.params.group,
            expenses: [] as ExpenseList,
            feed: [],
            expenseArrayId: 'expenses-' + this.props.navigation.state.params.group.id,
            persons: [] as ReactNode[]
        };
    }

    render() {
        let { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Picker selectedValue={this.state.person} onValueChange={(person: string) => this.onPersonChange(person)}>
                    <Picker.Item key={'All'} value={'All'} label={'All'} />
                    {this.state.persons}
                </Picker>
                <ScrollView style={styles.ScrollContainer}>
                    {this.state.feed}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding' style={styles.footer} >
                    <TouchableOpacity onPress={() => this.addExpense(navigate)} style={styles.addButton}>
                        <Text style={styles.addButtonText}> + </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    onPersonChange(person: string) {
        this.setState({ person }, this.updateView);
    }

    updateState = (data: any) => {
        this.setState(data);
    }

    addExpense(navigate: any) {
        let screen = 'GroupAddExpense';
        navigate(screen, { expenseArray: this.state.expenses, expenseArrayId: this.state.expenseArrayId, updateFeedState: this.updateState, group: this.state.group });
    }

    updateView() {
        let { navigate } = this.props.navigation;
        let feed: ReactNode[] = [];
        this.state.expenses.map((val: Expense, key: any) => {
            if (this.state.person !== 'All') {
                val.balances.map((bal: Balance) => {
                    if (bal.person.id === this.state.person) {
                        feed.push(<ExpenseItem key={key} keyval={key} val={val}
                            viewDetails={() => this.viewDetails(key, navigate)} />);
                    }
                });
            } else {
                feed.push(<ExpenseItem key={key} keyval={key} val={val}
                    viewDetails={() => this.viewDetails(key, navigate)} />);
            }
        });
        this.setState({ feed });
    }

    viewDetails(key: number, navigate: any) {
        let expense = this.state.expenses[key];
        let screen = this.state.expenseArrayId === 'expenses' ? 'ExpenseDetail' : 'GroupExpenseDetail';
        navigate(screen, { expense: expense });
    }

    componentDidMount() {
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    let expenses = JSON.parse(value);

                    expenses = expenses.sort((exp1: Expense, exp2: Expense) => {
                        let a = exp1.date;
                        let b = exp2.date;
                        a = a.split('-').join('');
                        b = b.split('-').join('');
                        return a > b ? 1 : a < b ? -1 : 0;
                    });
                    // Expenses is now sorted by date
                    this.setState({ expenses: expenses }, this.updateView);
                }
            });

        AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    let array = JSON.parse(value);
                    if (array) {
                        let persons = array.map((val: Person) => {
                            return <Picker.Item key={val.id} value={val.id} label={val.firstname + ' ' + val.lastname} />;
                        });

                        this.setState({ persons });
                    }
                }
            });
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
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
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    currentMembers: {
        flex: 3
    },
    deleteButton: {
        height: 40,
        paddingVertical: 10
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