import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { currencies } from '../../config/Data';
import { OptionPicker } from '../../components/Pickers/OptionPicker';
import { CurrencyInputPicker } from '../../components/Pickers/CurrencyInputPicker';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { ErrorText } from '../../components/Text/ErrorText';
import { GreenButton } from '../../components/Buttons/GreenButton';

interface IState {
    group: Group;
    groupArray: GroupList;
    currencies: Currencies;
    error: string;
}

class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            error: '',
            group: {} as Group,
            groupArray: this.props.navigation.state.params.groupArray,
            currencies: {} as Currencies
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.flex}>
                    <Text style={styles.title}>New Group</Text>
                    <ErrorText errorText={this.state.error}/>
                </View>

                <KeyboardAvoidingView behavior='padding'>
                    <InputWithoutLabel
                        placeholder={'Group name'}
                        onChangeText={(text: string) => {
                            const group = Object.assign({}, this.state.group, { name: text });
                            this.setState({ group });
                        }}
                        returnKeyType={'done'}
                    />
                </KeyboardAvoidingView>

                <GreenButton buttonText={'BACK'} onPress={() => goBack()}/>
                <GreenButton buttonText={'SAVE'} onPress={() => this.validate(goBack)}/>
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

    validate(navigate: any) {
        let error = '';
        if (this.state.group.name === undefined || this.state.group.name === '') {
            error += 'Group name can not be empty';
        }

        this.setState({ error: error }, () => {
            if (error === '') {
                this.save(navigate);
            }
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
    flex: {
        flex: 1
    },
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
    picker: {
        flex: 1
    }
});
