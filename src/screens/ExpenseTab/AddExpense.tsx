import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, AsyncStorage, StatusBar, Dimensions } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { _currencies } from '../../config/Data';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { parseMoney } from '../../utils/parsemoney';
import { InputWithLabel } from '../../components/TextInput/InputWithLabel';
import DatePicker from 'react-native-datepicker';
import { showError } from '../../utils/popup';
import { resetState } from '../../utils/navigationactions';

interface IState {
    persons: PersonList;
    expense: Expense;
    currencies: Currencies;
    expenseArray: ExpenseList;
    amountString: string;
    donor: Person;
    receiver: Person;
}

export class AddExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            expense: {
                description: '',
                category: 'Entertainment',
                currency: {} as Currency,
                amount: 0,
                date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
                balances: [],
                image: null
            },
            amountString: '0',
            persons: [] as PersonList,
            currencies: _currencies,
            expenseArray: this.props.navigation.state.params.expenseArray,
            donor: {
                firstname: '',
                lastname: ''
            } as Person,
            receiver: {
                firstname: '',
                lastname: ''
            } as Person
        };
    }

    render() {
        let { width } = Dimensions.get('window');
        const { goBack, dispatch, navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.flex}>
                    <Text style={styles.title}>New Expense</Text>
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
                        autoCapitalize={'sentences'}
                    />

                    <DatePicker
                        style={{ width: width - 40 }}
                        date={this.state.expense.date}
                        mode='date'
                        placeholder='Select Date'
                        format='YYYY-MM-DD'
                        minDate='2000-01-01'
                        maxDate={this.state.expense.date}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date: string) => {
                            const expense = Object.assign({}, this.state.expense, { date: date });
                            this.setState({ expense });
                        }}
                    />

                    <InputWithLabel
                        labelText={'Donor'}
                        placeholder={'Firstname Lastname'}
                        options={this.state.persons.map(a => a.firstname + ' ' + a.lastname)}
                        selectOption={(option: string) => this.setDonor(option)}
                        onChangeText={(donor: string) => {
                            this.setDonor(donor);
                        }}
                        onSubmitEditing={() => (this as any).receiver.focus()}
                        inputref={(input: any) => { (this as any).donor = input; }}
                        returnKeyType={'next'}
                        autoCapitalize={'words'}
                    />

                    <InputWithLabel
                        labelText={'Receiver'}
                        placeholder={'Firstname Lastname'}
                        options={this.state.persons.map(a => a.firstname + ' ' + a.lastname)}
                        selectOption={(option: string) => this.setReceiver(option)}
                        onChangeText={(receiver: string) => {
                            this.setReceiver(receiver);
                        }}
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
                                value={this.state.amountString}
                                onChangeText={(value: string) => this.updateAmount(value)}
                                inputref={(input: any) => { (this as any).amount = input; }}
                                returnKeyType={'done'}
                            />
                        </View>
                        <View style={styles.flex}>
                            <CurrencyPicker
                                currencies={this.state.currencies}
                                onValueChange={(currency: any) => {
                                    const expense = Object.assign({}, this.state.expense, { currency: currency });
                                    this.setState({ expense });
                                }}
                                selectedValue={this.state.expense.currency}
                            />
                        </View>
                    </View>

                    <CategoryPicker
                        onValueChange={this.setCategory.bind(this)}
                        selectedValue={this.state.expense.category}
                    />
                </KeyboardAvoidingView>

                <GreenButton buttonText='Select Image' onPress={() => navigate('ImageSelector', { expense: this.state.expense, updateImage: this.updateImage })} />

                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} buttonText={'SAVE'} onPress={() => this.validate(dispatch)} />
                    </View>
                </View>
            </View>
        );
    }

    updateImage (image: any) {
        const expense = Object.assign({}, this.state.expense, { image: image });
        this.setState({ expense });
    }

    // Expense Amount

    updateAmount(value: string) {
        let amount = parseMoney(value);
        const expense = Object.assign({}, this.state.expense, { amount: parseFloat(amount) });
        this.setState({ expense: expense, amountString: amount });
    }

    // Donor and Receiver

    setDonor(text: string) {
        this.setState({ donor: this.createPerson(text) });
    }

    setReceiver(text: string) {
        this.setState({ receiver: this.createPerson(text) });
    }

    createPerson(text: string) {
        let firstname = text.split(' ')[0].trim();
        let lastname = text.split(' ').slice(1).join(' ').trim() || '';
        return {
            firstname: firstname,
            lastname: lastname,
            id: firstname + lastname,
            balance: 0
        } as Person;
    }

    // Category

    setCategory(cat: string) {
        const expense = Object.assign({}, this.state.expense, { category: cat });
        this.setState({ expense });
    }

    // CRUD

    saveExpense(dispatch: any) {
        let balances = [
            { person: this.state.donor, amount: this.state.expense.amount, currency: this.state.expense.currency },
            { person: this.state.receiver, amount: -1 * this.state.expense.amount, currency: this.state.expense.currency }
        ];

        const expense = Object.assign({}, this.state.expense, { balances: balances });
        this.setState({ expense }, () => {
            this.addExpenseToStorage()
                .then(() => {
                    resetState('ExpenseFeed', dispatch);
                });
        });
    }

    validate(navigate: any) {
        let error = '';
        if (this.state.expense.description.trim() === '') {
            error += 'Description can not be empty';
        }
        if (this.state.donor.firstname.trim() === '') {
            error += '\nDonor can not be empty';
        }
        if (this.state.receiver.firstname.trim() === '') {
            error += '\nReceiver can not be empty';
        }
        if (this.state.expense.amount.toString() === '' || isNaN(this.state.expense.amount) || this.state.expense.amount < 0) {
            error += '\nAmount can not be empty';
        }
        if (this.state.donor.id === this.state.receiver.id) {
            error += '\nDonor and receiver can not be the same person';
        }

        if (error === '') {
            this.saveExpense(navigate);
        } else {
            showError(error);
        }

    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': parseFloat(this.state.expense.amount.toString()),
                'currency': this.state.expense.currency,
                'description': this.state.expense.description.trim(),
                'category': this.state.expense.category,
                'balances': this.state.expense.balances,
                'image': this.state.expense.image,
                'isTransaction': true
            });

            let donor = this.state.donor;
            if (!this.state.persons.find(function (obj: Person) { return obj.id === donor.id; })) {
                this.state.persons.push(donor);
            }

            let receiver = this.state.receiver;
            if (!this.state.persons.find(function (obj: Person) { return obj.id === receiver.id; })) {
                this.state.persons.push(receiver);
            }

            await AsyncStorage.multiSet([
                ['expenses', JSON.stringify(this.state.expenseArray)],
                ['persons', JSON.stringify(this.state.persons)]
            ]);
        } catch (error) {
            showError(error);
        }
    }

    async componentDidMount() {
        let persons = await AsyncStorage.getItem('persons')
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.persons;
                }
            });

        let currencies = await AsyncStorage.getItem('currencies')
            .then((value) => {
                if (value) {
                    return JSON.parse(value).rates;
                } else {
                    return this.state.currencies;
                }
            });

        let expense = await AsyncStorage.getItem('defaultCurrency')
            .then((value) => {
                if (value) {
                    return Object.assign({}, this.state.expense, { currency: JSON.parse(value) });
                } else {
                    return this.state.expense;
                }
            });

        this.setState({ expense, currencies, persons });
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
    }
});