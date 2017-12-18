import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, Picker, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { currencies } from '../../config/Data';

interface IState {
    expense: Expense;
    error: string;
    currencies: Currencies;
    expenseArray: ExpenseList;
    expenseArrayId: string;
}

export class AddExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let dat = new Date();
        this.state = {
            expense: {
                description: '',
                category: '',
                donor: '',
                receiver: '',
                currency: 'EUR',
                amount: 0,
                date: dat.getDate() + '/' + (dat.getMonth() + 1) + '/' + dat.getFullYear()
            },
            currencies: currencies,
            expenseArray: this.props.navigation.state.params.expenseArray,
            expenseArrayId: this.props.navigation.state.params.expenseArrayId || 'expenses',
            error: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>New Expense</Text>
                    <Text style={styles.errorStyle}> {this.state.error} </Text>
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
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { donor: text });
                            this.setState({ expense });
                        }}
                        onSubmitEditing={() => (this as any).receiver.focus()}
                        inputref={(input: any) => { (this as any).donor = input; }}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <InputWithoutLabel
                        placeholder={'Receiver'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { receiver: text });
                            this.setState({ expense });
                        }}
                        onSubmitEditing={() => (this as any).amount.focus()}
                        inputref={(input: any) => { (this as any).receiver = input; }}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.inputAmount}>
                            <InputWithoutLabel
                                keyboardType={'numeric'}
                                placeholder={'Amount'}
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

                    <InputWithoutLabel
                        placeholder={'Category'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { category: text });
                            this.setState({ expense });
                        }}
                        returnKeyType={'done'}
                        autoCapitalize={'words'}
                    />
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => goBack()}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.validate(goBack)}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    save(goBack: any) {
        this.addExpenseToStorage()
            .then(() => {
                goBack();
                this.props.navigation.state.params.updateFeedState({ expenseArray: this.state.expenseArray });
            });
    }

    validate(navigate: any) {
        console.log(this.state.expense.donor);
        console.log(this.state.expense.receiver);
        console.log(this.state.expense.currency);
        console.log(this.state.expense.amount);

        if (this.state.expense.donor === '' || this.state.expense.receiver === '' || this.state.expense.amount < 0) {
            this.setState({ error: 'Please fill out all fields' });
            console.log('error:' + this.state.error);
        } else {
            this.save(navigate);
        }
    }

    async componentWillMount() {
        AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    this.setState({
                        currencies: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        currencies: currencies
                    });
                }
            });
        await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'donor': this.state.expense.donor,
                'receiver': this.state.expense.receiver,
                'description': this.state.expense.description,
                'category': this.state.expense.category
            });

            await AsyncStorage.setItem(this.state.expenseArrayId, JSON.stringify(this.state.expenseArray));
        } catch (error) {
            console.log(error);
        }
    }
}

export default AddExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
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
    },
    errorStyle: {
        padding: 20,
        color: 'red',
        paddingHorizontal: 10,
        marginBottom: 10
    },
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