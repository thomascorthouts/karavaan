import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, StatusBar } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { ErrorText } from '../../components/Text/ErrorText';
import { currencies } from '../../config/Data';
import { GreenButton } from '../../components/Buttons/GreenButton';

interface IState {
    persons: PersonList;
    expense: Expense;
    error: string;
    currencies: Currencies;
    expenseArray: ExpenseList;
    expenseArrayId: string;
    donor: string;
    receiver: string;
}

export class AddExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let dat = new Date();
        this.state = {
            expense: {
                description: '',
                category: 'Entertainment',
                currency: 'EUR',
                amount: 0,
                date: dat.getDate() + '/' + (dat.getMonth() + 1) + '/' + dat.getFullYear(),
                balances: []
            },
            persons: [],
            currencies: currencies,
            expenseArray: this.props.navigation.state.params.expenseArray,
            expenseArrayId: this.props.navigation.state.params.expenseArrayId || 'expenses',
            error: '',
            donor: '',
            receiver: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={styles.flex}>
                    <Text style={styles.title}>New Expense</Text>
                    <ErrorText errorText={this.state.error} />
                </View>

                <KeyboardAvoidingView behavior={'padding'}>
                    <InputWithoutLabel
                        placeholder={'Description'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { description: text });
                            this.setState({ expense });
                        }}
                        onSubmitEditing={() => (this as any).donor.focus()}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <InputWithoutLabel
                        placeholder={'Donor'}
                        onChangeText={(donor: string) => this.setState({ donor })}
                        onSubmitEditing={() => (this as any).receiver.focus()}
                        inputref={(input: any) => { (this as any).donor = input; }}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <InputWithoutLabel
                        placeholder={'Receiver'}
                        onChangeText={(receiver: string) => this.setState({ receiver })}
                        onSubmitEditing={() => (this as any).amount.focus()}
                        inputref={(input: any) => { (this as any).receiver = input; }}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.inputAmount}>
                            <InputWithoutLabel
                                keyboardType={'numeric'}
                                placeholder={'Amount'}
                                value={this.state.expense.amount.toString()}
                                onChangeText={(value: number) => {
                                    const expense = Object.assign({}, this.state.expense, { amount: value });
                                    this.setState({ expense });
                                }}
                                inputref={(input: any) => { (this as any).amount = input; }}
                                returnKeyType={'done'}
                            />
                        </View>
                        <View style={styles.picker}>
                            <CurrencyPicker
                                currentCurrency={this.state.expense.currency}
                                currencies={this.state.currencies}
                                onValueChange={(currency: any) => {
                                    const expense = Object.assign({}, this.state.expense, { currency: currency });
                                    this.setState({ expense });
                                }}
                                selectedValue={this.state.expense.currency}
                            />
                        </View>
                    </View>

                    <CategoryPicker onValueChange={this.setCategory.bind(this)}
                    selectedValue={this.state.expense.category}/>
                </KeyboardAvoidingView>

                <GreenButton buttonText={'BACK'} onPress={() => goBack()}/>
                <GreenButton buttonText={'SAVE'} onPress={() => this.validate(goBack)}/>
            </View>
        );
    }

    setCategory(cat: string) {
        const expense = Object.assign({}, this.state.expense, { category: cat });
        this.setState({ expense });
    }
    isDonor(person: Person) {
        return person.id === this.state.donor;
    }

    isReceiver(person: Person) {
        return person.id === this.state.receiver;
    }

    save(goBack: any) {
        let balances = [{ person: this.state.persons.find(this.isDonor), amount: this.state.expense.amount, currency: this.state.expense.currency }, { person: this.state.persons.find(this.isReceiver), amount: this.state.expense.amount, currency: this.state.expense.currency }];
        const expense = Object.assign({}, this.state.expense, { balances: balances });
        this.setState({ expense }, () => {
            this.addExpenseToStorage()
                .then(() => {
                    goBack();
                    this.props.navigation.state.params.updateFeedState({ expenseArray: this.state.expenseArray });
                });
        });
    }

    validate(navigate: any) {
        let error = '';
        if (this.state.donor === '') {
            error += '\nDescription can not be empty';
        }
        if (this.state.donor === '') {
            error += '\nDonor can not be empty';
        }
        if (this.state.receiver === '') {
            error += '\nReceiver can not be empty';
        }
        if (this.state.expense.amount.toString() === '' || isNaN(this.state.expense.amount) || this.state.expense.amount < 0) {
            error += '\nAmount can not be empty';
        }

        this.setState({ error: error }, () => {
            if (error === '') {
                this.save(navigate);
            }
        });
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'description': this.state.expense.description,
                'category': this.state.expense.category,
                'balances': this.state.expense.balances
            });

            await AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            console.log(error);
        }
    }

    async componentWillMount() {
        AsyncStorage.getItem('all_users')
            .then((value) => {
                if (value) {
                    this.setState({
                        persons: JSON.parse(value)
                    });
                }
            });

        AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    this.setState({
                        currencies: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        currencies: currencies
                    }, () => {
                        AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
                    });
                }
            });
    }
}

export default AddExpense;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
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
    inputAmount: {
        flex: 2
    },
    picker: {
        flex: 1
    }
});