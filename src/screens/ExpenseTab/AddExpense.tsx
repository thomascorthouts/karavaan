import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, Picker, KeyboardAvoidingView, AsyncStorage, Image, CameraRoll, TouchableHighlight } from 'react-native';
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
                category: '',
                amount: 0,
                currency: 'EUR €',
                photos: [],
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

                    <InputWithoutLabel
                        placeholder={'Category'}
                        onChangeText={(text: string) => {
                            const expense = Object.assign({}, this.state.expense, { category: text });
                            this.setState({ expense });
                        }}
                        returnKeyType={'next'}
                        onSubmitEditing={() => (this as any).amount.focus()}
                        inputref={(input: any) => { (this as any).category = input; }}
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
                            <Picker.Item label='EUR / €' value='EUR' />
                            <Picker.Item label='USD / $' value='USD' />
                            <Picker.Item label='AUD / $A' value='AUD' />
                            <Picker.Item label='BGN / Lv' value='BGN' />
                            <Picker.Item label='BRL / R$' value='BRL' />
                            <Picker.Item label='CAD / C$' value='CAD' />
                            <Picker.Item label='CHF / SFr' value='CHF' />
                            <Picker.Item label='CNY / C$' value='CNY' />
                            <Picker.Item label='CZK / C$' value='CZK' />
                            <Picker.Item label='DKK / C$' value='DKK' />
                            <Picker.Item label='GBP / £' value='GBP' />
                            <Picker.Item label='HKD / £' value='HKD' />
                            <Picker.Item label='HRK / £' value='HRK' />
                            <Picker.Item label='HUF / £' value='HUF' />
                            <Picker.Item label='IDR / £' value='IDR' />
                            <Picker.Item label='ILS / £' value='ILS' />
                            <Picker.Item label='INR / £' value='INR' />
                            <Picker.Item label='JPY / £' value='JPY' />
                            <Picker.Item label='KRW / £' value='KRW' />
                            <Picker.Item label='MXN / £' value='MXN' />
                            <Picker.Item label='MYR / £' value='MYR' />
                            <Picker.Item label='NOK / £' value='NOKk' />
                            <Picker.Item label='NZD / £' value='NZD' />
                            <Picker.Item label='PHP / £' value='PHP' />
                            <Picker.Item label='PLN / £' value='PLN' />
                            <Picker.Item label='RON / £' value='RON' />
                            <Picker.Item label='RUB / £' value='RUB' />
                            <Picker.Item label='SEK / £' value='SEK' />
                            <Picker.Item label='SGD / £' value='SGD' />
                            <Picker.Item label='THB / £' value='THB' />
                            <Picker.Item label='TRY / £' value='TRY' />
                            <Picker.Item label='ZAR / £' value='ZAR' />
                        </Picker>
                    </View>
                </KeyboardAvoidingView>

                <ScrollView>
                    {this.state.expense.photos.map((p: any, i: any) => {
                        return (
                            <Image
                                key={i}
                                style={{
                                    width: 300,
                                    height: 100
                                }}
                                source={{ uri: p.node.image.uri }}
                            />
                        );
                    })}
                </ScrollView>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this._handleButtonPress()}>
                    <Text style={styles.buttonText}>Add picture</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => goBack()}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.validate(goBack)}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _handleButtonPress = () => {
        CameraRoll.getPhotos({
            first: 4,
            assetType: 'All'
        })
            .then(r => {
                console.log(r.edges);
                const expense = Object.assign({}, this.state.expense, { photos: r.edges });
                this.setState({ expense });
            })
            .catch((err) => {
                console.log('error');
            });
    };

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
                'category': this.state.expense.category,
                'currency': this.state.expense.currency,
                'firstname': this.state.expense.firstname,
                'lastname': this.state.expense.lastname,
                'photos': this.state.expense.photos
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
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10
    }
});