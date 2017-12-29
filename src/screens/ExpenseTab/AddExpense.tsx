import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, StatusBar, Alert } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { ErrorText } from '../../components/Text/ErrorText';
import { currencies } from '../../config/Data';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { InputWithLabel } from '../../components/TextInput/InputWithLabel';
import * as StringSimilarity from '../../similarity';

interface IState {
    persons: PersonList;
    expense: Expense;
    currencies: Currencies;
    expenseArray: ExpenseList;
    donor: Person;
    donorSuggestion: string;
    receiver: Person;
    receiverSuggestion: string;
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
            donor: {
                firstname: '',
                lastname: ''
            } as Person,
            donorSuggestion: '',
            receiver: {
                firstname: '',
                lastname: ''
            } as Person,
            receiverSuggestion: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;

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
                        autoCapitalize={'words'}
                    />

                    <InputWithLabel
                        labelText={'Donor'}
                        placeholder={'Firstname Lastname'}
                        suggestion={this.state.donorSuggestion}
                        suggestionPress={() => this.selectDonorSuggestion()}
                        onBlur={() => this.setState({donorSuggestion: ''})}
                        onChangeText={(donor: string) => {
                            this.findSuggestion(donor, 'donor');
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
                        suggestion={this.state.receiverSuggestion}
                        suggestionPress={() => this.selectReceiverSuggestion()}
                        onBlur={() => this.setState({receiverSuggestion: ''})}
                        onChangeText={(receiver: string) => {
                            this.findSuggestion(receiver, 'receiver');
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
                                value={this.state.expense.amount.toString()}
                                onChangeText={(value: number) => {
                                    const expense = Object.assign({}, this.state.expense, { amount: value });
                                    this.setState({ expense });
                                }}
                                inputref={(input: any) => { (this as any).amount = input; }}
                                returnKeyType={'done'}
                            />
                        </View>
                        <View style={styles.flex}>
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

                    <CategoryPicker
                        onValueChange={this.setCategory.bind(this)}
                        selectedValue={this.state.expense.category}
                    />
                </KeyboardAvoidingView>

                <GreenButton buttonText={'BACK'} onPress={() => goBack()} />
                <GreenButton buttonText={'SAVE'} onPress={() => this.validate(goBack)} />
            </View>
        );
    }

    findSuggestion(text: string, type: string) {
        let bestSuggestion = StringSimilarity.findBestMatch(text, this.state.persons.map(a => a.firstname + ' ' + a.lastname));
        if (type === 'donor') {
            this.setState({donorSuggestion: bestSuggestion});
        } else {
            this.setState({receiverSuggestion: bestSuggestion});
        }
    }

    selectDonorSuggestion() {
        let newDonor = this.state.donorSuggestion;
        (this as any).donor.setNativeProps({text: newDonor});
        this.setState({donorSuggestion: '', donor: this.createPerson(newDonor)});
    }

    selectReceiverSuggestion() {
        let newReceiver = this.state.receiverSuggestion;
        (this as any).receiver.setNativeProps({text: newReceiver});
        this.setState({receiverSuggestion: '', receiver: this.createPerson(newReceiver)});
    }

    setCategory(cat: string) {
        const expense = Object.assign({}, this.state.expense, { category: cat });
        this.setState({ expense });
    }

    setDonor(text: string) {
        this.setState({donor: this.createPerson(text)});
    }

    setReceiver(text: string) {
        this.setState({receiver: this.createPerson(text)});
    }

    save(goBack: any) {
        let balances = [
            { person: this.state.donor, amount: this.state.expense.amount, currency: this.state.expense.currency },
            { person: this.state.receiver, amount: -1 * this.state.expense.amount, currency: this.state.expense.currency }
        ];
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

        if (error === '') {
            this.save(navigate);
        } else {
            this.showError(error);
        }

    }

    createPerson(text: string) {
        let firstname = text.split(' ')[0].trim();
        let lastname = text.split(' ').slice(1).join(' ').trim() || '';
        let person = {
            firstname: firstname,
            lastname: lastname,
            id: firstname + lastname,
            balance: 0
        } as Person;
        return person;
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': parseFloat(this.state.expense.amount.toString()),
                'currency': this.state.expense.currency,
                'description': this.state.expense.description.trim(),
                'category': this.state.expense.category,
                'balances': this.state.expense.balances
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
            console.log(error);
        }
    }

    showError(error: string) {
        Alert.alert('Warning', error.replace(/^[\n\r]+/, '').trim(),
            [
                { text: 'OK', onPress: () => { return false; } }
            ],
            { onDismiss: () => undefined }
        );
        return true;
    }

    componentWillMount() {
        AsyncStorage.getItem('persons')
            .then((value) => {
                if (value) {
                    console.log(value);
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
    }
});