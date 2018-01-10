import React, { Component } from 'react';
import { View, Text, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { parseMoney } from '../../utils/parsemoney';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetGroupState } from '../../utils/navigationactions';
import { InputWithLabel } from '../../components/TextInput/InputWithLabel';
import { showError } from '../../utils/popup';
import {backgroundColorStyles, specificStyles, standardStyles} from '../screenStyles';

interface Options {
    splitMode: boolean;
    currency: Currency;
    amount: number;
    description: string;
    currencies: Currencies;
    date: string;
    category: string;
    image: any;
}

interface IProps {
    navigation: any;
}

interface IState {
    group: Group;
    options: Options;
    expense: Expense;
    currencies: Currencies;
    donor: Person;
    receiver: Person;
    expenseArray: ExpenseList;
    personArray: PersonList;
    amountString: string;
}

class TransSplit extends Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        let options = this.props.navigation.state.params.opts as Options;
        this.state = {
            group: this.props.navigation.state.params.group,
            options: options,
            expense: {
                balances: [],
                description: options.description,
                amount: options.amount,
                currency: options.currency,
                category: options.category,
                date: options.date,
                image: options.image
            },
            currencies: options.currencies as Currencies,
            donor: {} as Person,
            receiver: {} as Person,
            expenseArray: [] as ExpenseList,
            personArray: [] as PersonList,
            amountString: options.amount.toString()
        };
    }

    render() {
        const { goBack, dispatch } = this.props.navigation;

        return (
            <View style={ [specificStyles.container, backgroundColorStyles.lightGreen] }>
                <View style={ standardStyles.flex }>
                    <Text style={ specificStyles.title }>{this.state.options.description}</Text>
                </View>

                <KeyboardAvoidingView behavior='padding'>
                    <View style={ standardStyles.rowContainer }>
                        <View style={ standardStyles.doubleFlex }>
                            <InputWithoutLabel
                                onChangeText={(value: string) => this.updateAmount(value)}
                                value={this.state.amountString}
                                onSubmitEditing={() => (this as any).donor.focus()}
                                returnKeyType={'next'}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={ standardStyles.flex }>
                            <CurrencyPicker
                                currencies={this.state.group.currencies}
                                onValueChange={(currency: Currency) => {
                                    const expense = Object.assign({}, this.state.expense, { currency: currency });
                                    this.setState({ expense });
                                }}
                                selectedValue={this.state.expense.currency}
                            />
                        </View>
                    </View>
                    <View>
                        <View>
                            <InputWithLabel
                                labelText={'Donor'}
                                placeholder={'Firstname Lastname'}
                                options={this.state.personArray.map(a => a.firstname + ' ' + a.lastname)}
                                selectOption={(option: string) => this.chooseDonor(option)}
                                onChangeText={(donor: string) => {
                                    this.chooseDonor(donor);
                                }}
                                onSubmitEditing={() => (this as any).receiver.focus()}
                                inputref={(input: any) => { (this as any).donor = input; }}
                                returnKeyType={'next'}
                                autoCapitalize={'words'}
                            />
                        </View>
                        <View>
                            <InputWithLabel
                                labelText={'Receiver'}
                                placeholder={'Firstname Lastname'}
                                options={this.state.personArray.map(a => a.firstname + ' ' + a.lastname)}
                                selectOption={(option: string) => this.chooseReceiver(option)}
                                onChangeText={(receiver: string) => {
                                    this.chooseReceiver(receiver);
                                }}
                                inputref={(input: any) => { (this as any).receiver = input; }}
                                returnKeyType={'done'}
                                autoCapitalize={'words'}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={ standardStyles.rowContainer }>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ specificStyles.leftButton} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ specificStyles.rightButton } onPress={() => this.addTransaction(dispatch)} buttonText={'ADD'} />
                    </View>
                </View>
            </View>
        );
    }

    updateAmount(value: string) {
        let amount = parseMoney(value);
        const expense = Object.assign({}, this.state.expense, { amount: parseFloat(value) });
        this.setState({ expense, amountString: amount });
    }

    chooseDonor(text: string) {
        this.choose(this.createPerson(text).id, true);
    }

    chooseReceiver(text: string) {
        this.choose(this.createPerson(text).id, false);
    }

    createPerson(text: string) {
        let firstname = text.split(' ')[0].trim();
        let lastname = text.split(' ').slice(1).join(' ').trim() || '';
        return {
            firstname: firstname,
            lastname: lastname,
            id: firstname + lastname
        } as Person;
    }

    choose(id: string, isDonor: boolean) {
        let p = this.state.personArray.find((val: Person) => { return (val.id === id); });
        if (typeof p !== 'undefined') {
            if (isDonor) this.setState({ donor: p });
            else this.setState({ receiver: p });
        }
    }

    addTransaction(dispatch: any) {
        if (!this.state.donor.id || !this.state.receiver.id || this.state.expense.amount === 0) {
            showError('Not all fields are filled in correctly');
        } else {
            let donor = this.state.donor;
            let receiver = this.state.receiver;

            let balances = [{
                person: donor,
                amount: this.state.expense.amount,
                currency: this.state.expense.currency
            }, {
                person: receiver,
                amount: this.state.expense.amount * (-1),
                currency: this.state.expense.currency
            }];

            const expense = Object.assign({}, this.state.expense, { balances: balances });
            this.setState({ expense }, () => {
                this.addExpenseToStorage()
                    .then(() => {
                        resetGroupState(this.state.group, this.state.expenseArray, dispatch);
                    });
            });
        }
    }

    async addExpenseToStorage() {
        try {
            this.state.expenseArray.push({
                'date': this.state.expense.date,
                'amount': this.state.expense.amount,
                'currency': this.state.expense.currency,
                'description': this.state.expense.description,
                'category': this.state.expense.category,
                'balances': this.state.expense.balances,
                'image': this.state.expense.image,
                'isTransaction': true
            });

            await AsyncStorage.multiSet([
                ['expenses-' + this.state.group.id, JSON.stringify(this.state.expenseArray)],
                ['persons-' + this.state.group.id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    async componentDidMount() {
        let personArray = await AsyncStorage.getItem('persons-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.personArray;
                }
            });

        let expenseArray = await AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.expenseArray;
                }
            });

        this.setState({ personArray, expenseArray });
    }
}

export default TransSplit;