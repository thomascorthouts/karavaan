import React, { Component } from 'react';
import { View, Picker, Button, KeyboardAvoidingView, StatusBar, StyleSheet, Dimensions, Text } from 'react-native';
import { InputWithLabel } from '../../components/TextInput/InputWithLabel';
import { CategoryPicker } from '../../components/Pickers/CategoryPicker';
import { parseMoney } from '../../utils/parsemoney';
import { currencies } from '../../config/Data';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import DatePicker from 'react-native-datepicker';
import { GreenButton } from '../../components/Buttons/GreenButton';

interface IState {
    description: string;
    group: Group;
    currency: Currency;
    amount: number;
    splitMode: string;
    category: string;
    amountString: string;
    date: string;
    image: any;
}

class GroupExpense extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let date = new Date();
        this.state = {
            description: '',
            group: this.props.navigation.state.params.group,
            currency: this.props.navigation.state.params.group.defaultCurrency,
            amount: 0,
            splitMode: 'trans',
            category: 'Entertainment',
            amountString: '',
            date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
            image: null
        };
    }

    render() {
        let { width } = Dimensions.get('window');
        const { goBack, navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <View style={styles.flex}>
                    <Text style={styles.title}>New Expense</Text>
                </View>

                <KeyboardAvoidingView behavior={'padding'}>
                    <InputWithLabel
                        labelText={'Description'}
                        onChangeText={(description: any) => this.setState({ description })}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.inputAmount}>
                            <InputWithoutLabel
                                onChangeText={(amount: string) => this.updateAmount(amount)}
                                value={this.state.amountString}
                                returnKeyType={'done'}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={styles.flex}>
                            <CurrencyPicker
                                currencies={this.state.group.currencies}
                                onValueChange={(currency: any) => this.setState({ currency })}
                                selectedValue={this.state.currency}
                            />
                        </View>
                    </View>

                    <DatePicker
                        style={{ width: width - 40 }}
                        date={this.state.date}
                        mode='date'
                        placeholder='Select Date'
                        format='YYYY-MM-DD'
                        minDate='2000-01-01'
                        maxDate={this.state.date}
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
                        onDateChange={(date: string) => this.setState({ date })}
                    />

                    <View>
                        <CategoryPicker onValueChange={this.updateCategory.bind(this)} selectedValue={this.state.category} />
                    </View>

                    <Picker selectedValue={this.state.splitMode} onValueChange={(splitMode: any) => this.setState({ splitMode })}>
                        <Picker.Item label={'Transaction'} value={'trans'} key={'trans'} />
                        <Picker.Item label={'Split evenly'} value={'even'} key={'even'} />
                        <Picker.Item label={'Bill Splitter'} value={'bill'} key={'bill'} />
                        <Picker.Item label={'Exact amounts'} value={'amounts'} key={'amounts'} />
                    </Picker>
                </KeyboardAvoidingView>

                <GreenButton buttonText='Select Image' onPress={() => navigate('ImageSelector', { expense: this.state.image, updateImage: this.updateImage })} />

                <View style={styles.rowContainer}>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginRight: 2 }} buttonText={'BACK'} onPress={() => goBack()} />
                    </View>
                    <View style={styles.flex}>
                        <GreenButton buttonStyle={{ marginLeft: 2 }} onPress={() => this.nextScreen(navigate)} buttonText={'NEXT'} />
                    </View>
                </View>
            </View>
        );
    }

    updateImage = (image: any) => {
        this.setState({ image });
    }

    updateAmount(value: string) {
        let amount = parseMoney(value);
        this.setState({ amountString: amount, amount: parseFloat(amount) });
    }

    updateCategory(cat: string) {
        this.setState({ category: cat });
    }

    nextScreen = (navigate: any) => {
        const props = {
            group: this.state.group,
            opts: {
                description: this.state.description,
                currencies: this.state.group.currencies,
                splitMode: (this.state.splitMode === 'even'),
                currency: this.state.currency,
                amount: this.state.amount,
                category: this.state.category,
                date: this.state.date,
                image: this.state.image
            }
        };

        if (this.state.splitMode === 'bill') {
            navigate('GroupAddBill', props);
        } else if (this.state.splitMode === 'trans') {
            navigate('GroupAddTransaction', props);
        } else {
            navigate('GroupAddByAmount', props);
        }
    }
}

export default GroupExpense;

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
        flex: 3.6
    }
});
