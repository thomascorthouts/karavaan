import React, { Component } from 'react';
import {View, Button, ScrollView, AsyncStorage} from 'react-native';
import {currencies} from '../../config/Data';
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
    expense: Expense;
    dishes: Array<Dish>;
    expenseArray: ExpenseList;
    personArray: PersonList;
};

class BillSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            group: this.props.navigation.state.params.group as Group,
            options: this.props.navigation.state.params.opts as Options,
            expense: {
                balances: [],
                description: this.props.navigation.state.params.opts.description,
                amount: this.props.navigation.state.params.opts.amount,
                currency:  this.props.navigation.state.params.opts.currency.tag,
                category: this.props.navigation.state.params.opts.category,
                date: date.getDay() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()
            },
            dishes: [] as Array<Dish>,
            expenseArray: [] as ExpenseList,
            personArray: [] as PersonList
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        let dishes = [] as Array<Dish>;
        dishes.push({name: 'drinken', amount: 10, users: ['thomas_corthouts', 'mathias_spanhove']});
        dishes.push({name: 'eten', amount: 20, users: ['thomas_corthouts', 'mathias_spanhove', 'serhat_erdogan', 'franci_haest']});
        this.setState({dishes});
        let items = dishes.map((val: Dish, index: number) => {
            return (<BillSplitterItem key={val.name} keyval={val} val={val.name} amount={val.amount} submitEditing={() => this.submitEditing()}/>);
        });
        return (
            <View>
                <ScrollView >
                    {items}
                </ScrollView>
                <Button title={'Add Item'} onPress={ () => this.addItem()}/>
                <Button title={'Add Expense'} onPress={() => this.confirm(navigate)}/>
            </View>
        );
    }

    addItem () {
        // TODO
        const test = 1;
    }

    submitEditing() {
        console.log('hello');
    }

    confirm(navigate: any) {

        this.addExpenseToStorage()
            .then(() => {
                navigate( 'GroupFeed' );
            });
    }

    async addExpenseToStorage() {
        console.log(this.state.expense.balances);
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'description': this.state.expense.description,
                'category': this.state.expense.category,
                'balances': this.state.expense.balances
            });

            await AsyncStorage.setItem('expenses-' + this.state.group.id, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            console.log(error);
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        personArray: JSON.parse(value)
                    });
                    console.log(this.state.personArray.length);
                }
            });

        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    this.setState({
                        expenseArray: JSON.parse(value)
                    });
                }
            });
    }
}

export default BillSplit;
