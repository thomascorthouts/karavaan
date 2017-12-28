import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, Picker, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';

interface IState {
    expense: Expense;
    error: string;
    expenseArray: ExpenseList;
    expenseArrayId: string;
}

export class AddExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let dat = new Date();
        this.state = {
            expense: {
                firstname: '',
                lastname: '',
                currency: 'EUR €',
                amount: 0,
                date: dat.getDate() + '/' + (dat.getMonth() + 1) + '/' + dat.getFullYear()
            },
            expenseArray: this.props.navigation.state.params.expenseArray,
            expenseArrayId: this.props.navigation.state.params.expenseArrayId || 'expenses',
            error: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;
        const values = ['1', '2'];
        const optionsGender = ['Male', 'Female'];
        const currencies = [
            'CAD',          // Canadian Dollar
            'EUR',          // Euro
            'GBP',          // British Pound
            'USD'           // US Dollar
        ];

        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />

                <Text style={styles.title}>New Expense</Text>
                <Text style={styles.errorStyle}> {this.state.error} </Text>

                <KeyboardAvoidingView behavior='padding'>
                    <InputWithoutLabel
                        placeholder={'Firstname'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { firstname: text });
                            this.setState({ expense });
                        }}
                        onSubmitEditing={() => (this as any).lastname.focus()}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <InputWithoutLabel
                        placeholder={'Lastname'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { lastname: text });
                            this.setState({ expense });
                        }}
                        returnKeyType={'next'}
                        onSubmitEditing={() => (this as any).amount.focus()}
                        inputref={(input: any) => { (this as any).lastname = input; }}
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
                                returnKeyType={'done'}
                                inputref={(input: any) => { (this as any).amount = input; }}
                            />
                        </View>

                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.expense.currency}
                            onValueChange={(itemValue, itemIndex) => {
                                const expense = Object.assign({}, this.state.expense, { currency: itemValue });
                                this.setState({ expense });
                            }} >
                            <Picker.Item label='EUR / €' value='EUR €' />
                            <Picker.Item label='CAD / $' value='CAD $' />
                            <Picker.Item label='GBP / £' value='GBP £' />
                            <Picker.Item label='USD / $' value='USD $' />
                        </Picker>
                    </View>
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
        console.log(this.state.expense.firstname);
        console.log(this.state.expense.lastname);
        console.log(this.state.expense.currency);
        console.log(this.state.expense.amount);

        if (this.state.expense.firstname === '' || this.state.expense.lastname === '' || this.state.expense.amount < 0) {
            this.setState({ error: 'Please fill out all fields' });
            console.log('error:' + this.state.error);
        } else {
            this.save(navigate);
        }
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'firstname': this.state.expense.firstname,
                'lastname': this.state.expense.lastname
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
        backgroundColor: '#4B9382',
        alignSelf: 'stretch'
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