import React, { Component } from 'react';
import { AppRegistry, FlexStyle, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, Button, ListView, Picker, Alert, KeyboardAvoidingView } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';

export class AddExpense extends Component<IDefaultNavProps, any> {

    constructor(props: IDefaultNavProps) {
        super(props);

        this.state = {
            firstname: '',
            lastname: '',
            itemValue: '',
            amount: '',
            error: ''
        };
    }

    _handlePress(nav: any) {
        if (this.state.firstname === '' || this.state.lastname === '' || this.state.amount === '') {
            this.setState({ error: 'Please fill out all fields' });
            console.log('error:' + this.state.error);
        } else {
            this.save(nav);
            // Do something here which you want to if all the Text Input is filled.
        }

        console.log(this.state.firstname);
        console.log(this.state.lastname);
        console.log(this.state.itemValue);
        console.log(this.state.amount);
    }

    render() {
        const { navigate } = this.props.navigation;
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
                        onChangeText={(text: string) => this.setState({ firstname: text })}
                        onSubmitEditing={() => (this as any).lastname.focus()}
                        returnKeyType={'next'}
                    />

                    <InputWithoutLabel
                        placeholder={'Lastname'}
                        onChangeText={(text: string) => this.setState({ lastname: text })}
                        returnKeyType={'next'}
                        onSubmitEditing={() => (this as any).amount.focus()}
                        inputref={(input: any) => {(this as any).lastname = input;}}
                    />

                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.inputAmount}>
                            <InputWithoutLabel
                                keyboardType={'numeric'}
                                placeholder={'Amount'}
                                onChangeText={(value: number) => this.setState({ amount: value })}
                                returnKeyType={'done'}
                                inputref={(input: any) => {(this as any).amount = input;}}
                            />
                        </View>

                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.itemValue}
                            onValueChange={(itemValue, itemIndex) => this.setState({ itemValue: itemValue })} >
                            <Picker.Item label='EUR / €' value='EUR' />
                            <Picker.Item label='CAD / $' value='CAD' />
                            <Picker.Item label='GBP / £' value='GBP' />
                            <Picker.Item label='USD / $' value='USD' />
                        </Picker>
                    </View>
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this._handlePress(navigate)} >
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    save(navigate: any) {
        navigate('Home');
    }

    componentWillReceiveProps(nextProps: any) {
        const {focus} = nextProps;
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