import React, {ReactNode} from 'react';
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

// vragen: 
    //Hoe doe je die waarschuwing weg?
    //Hoe veld clearen?


class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);
        this.state = {
            group: {} as Group,
            groupArray: this.props.navigation.state.params.groupArray,
            currencies: {} as Currencies,
            error: '',
        };
    }

    render() {
        const { goBack } = this.props.navigation;
        let members: ReactNode[] = new Array();
        const personArray = this.state.group.personArray;

        const num = personArray.map((person: string, key: any) => {
             members.push(<TextInput style={styles.input} returnKeyType={'next'} autoCapitalize={'words'} 
             value={person} onChangeText={(text) =>  
                 {
                 this.updatePerson(text, key);}}/>)
        });


        return (
            <View style={styles.container}>
// <<<<<<< franci
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

                        <TextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            value={this.state.group.date}
                            onChangeText={(text) => {
                                const group = Object.assign({}, this.state.group, { date: text });
                                this.setState({ group });
                            }}
                            returnKeyType={'next'}
                        />

                        <Text> Members </Text>
                        {members}
                        <Text></Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={'new member'}
                            returnKeyType={'next'} 
                            autoCapitalize={'words'} 
                            onSubmitEditing={(text) => 
                                {
                                    this.addPerson(text.nativeEvent.text);
                                }
                                
                            }
                        />

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => goBack()}>
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.validate(goBack)}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                        <Text style={styles.errorText}>{this.state.error}</Text>
// =======
                <View style={styles.flex}>
                    <Text style={styles.title}>New Group</Text>
                    <ErrorText errorText={this.state.error}/>
                </View>
// >>>>>>> mathias

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

    // Mathias
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
  
    // Franci
    validate(navigate: any){
        if (this.state.group.date === '' || this.state.group.name === '' || this.state.group.personArray.length === 0){
            this.setState( {error: 'Please fill out all fields'})
        } else {
            this.save(navigate);
        }
    }

    updatePerson(person: string, key: any){
        if (person !== ''){
            this.state.group.personArray[key] = person;
        } else {
            this.state.group.personArray.splice(key, 1);
        }
        const group = this.state.group;
        this.setState({ group: group});
    }

    addPerson(name: string) {
        if (name !== ''){
            this.state.group.personArray.push(name);
            const group = this.state.group;
            this.setState({group: group});
        }
    }

    async addGroupToStorage() {
        let id = this.state.group.name + '#' + new Date().toISOString();
        try {
            this.state.groupArray.push({
                'groupId': 'G' + this.state.group.name + '#' + new Date().toISOString(),
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
