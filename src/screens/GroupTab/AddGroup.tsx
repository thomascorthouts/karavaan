import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { currencies } from '../../config/Data';
import OptionPicker from '../../components/Pickers/OptionPicker';
import CurrencyInputPicker from '../../components/Pickers/CurrencyInputPicker';

interface IState {
    group: Group;
    groupArray: GroupList;
    currencies: Currencies;
}

class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            group: {} as Group,
            groupArray: this.props.navigation.state.params.groupArray,
            currencies: {} as Currencies
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.formcontainer}>
                        <StatusBar barStyle={'light-content'} />

                        <Text style={styles.title}>New Group</Text>

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
        let id = this.state.group.name + '#' + new Date().toISOString();
        try {
            this.state.groupArray.push({
                'name': this.state.group.name,
                'id': id,
                'defaultCurrencies': this.state.group.defaultCurrencies
            });

            await AsyncStorage.multiSet([['groups', JSON.stringify(this.state.groupArray)],
                                        ['expenses-' + id, JSON.stringify([])],
                                        ['persons-' + id, JSON.stringify([])]]);
        } catch (error) {
            console.log(error);
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
                    }, () => {
                        AsyncStorage.setItem('currencies', JSON.stringify(this.state.currencies));
                    });
                }
            });
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
