import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';
import {CurrencyPicker} from '../../components/CurrencySelector';
import {currencies} from '../../config/Data';

interface IState {
    group: Group;
    groupArray: GroupList;
    currencies: Currencies;
    currentCurrencyTag: string;
}

class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            group: {
                id: '',
                name: '',
                personArray: [] as PersonList,
                expenseArrayId: '',
                defaultCurrency: {} as Currency
            },
            groupArray: this.props.navigation.state.params.groupArray,
            currencies: {} as Currencies,
            currentCurrencyTag: 'EUR'
        };
    }

    async componentWillMount() {

        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => {
                if (data.rates) {
                    let key;
                    for (key in data.rates) {
                        this.state.currencies[key].rate = data.rates[key];
                    }
                    this.setState({
                        currencies: this.state.currencies,
                    });
                } else {
                    throw 'Mattias';
                }
            })
            .catch(() => {
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
            });
        await AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.formcontainer}>
                        <StatusBar barStyle={'light-content'} />

                        <Text style={styles.title}>New Expense</Text>

                        <TextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={'Group name'}
                            onChangeText={(text) => {
                                const group = Object.assign({}, this.state.group, { name: text });
                                this.setState({ group });
                            }}
                            returnKeyType={'next'}
                        />

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => goBack()}>
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(goBack)}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                        <CurrencyPicker currentCurrency={this.state.currentCurrencyTag}
                                        currencies={this.state.currencies}
                                        onValueChange={(text: any) => {
                                                    this.setState({currentCurrencyTag: text});
                                                    const group = Object.assign({}, this.state.group, { defaultCurrency: this.state.currencies[this.state.currentCurrencyTag]});
                                                    this.setState({ group });
                                        }}
                                        selectedValue={this.state.currentCurrencyTag}/>

                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }

    save(goBack: any) {
        this.addGroupToStorage()
            .then(() => {
                goBack();
                this.props.navigation.state.params.updateFeedState({ groupArray: this.state.groupArray });
            });
    }

    async addGroupToStorage() {
        try {
            this.state.groupArray.push({
                'name': this.state.group.name,
                'id': this.state.group.id,
                'personArray': this.state.group.personArray,
                'expenseArrayId': this.state.group.name + '#' + new Date().toISOString(),
                'defaultCurrency': this.state.group.defaultCurrency
            });

            await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray));
        } catch (error) {
            console.log(error);
        }
    }
}
export default AddGroupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B9382',
        alignSelf: 'stretch'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    formcontainer: {
        padding: 20
    },
    input: {
        height: 41,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
    },
    picker: {
        width: '100%'
    },
    inputAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 41,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
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