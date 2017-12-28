import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Picker, AsyncStorage, Dimensions, StatusBar, Alert } from 'react-native';
import { CurrencyPicker } from '../../components/CurrencySelector';
import { currencies } from '../../config/Data';
import { OptionPicker } from '../../components/Pickers/OptionPicker';
import { CurrencyInputPicker } from '../../components/Pickers/CurrencyInputPicker';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { ErrorText } from '../../components/Text/ErrorText';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { reset } from '../../NavigationActions';

interface IState {
    group: Group;
    groupArray: GroupList;
    personArray: PersonList;
    currencies: Currencies;
    update: boolean;
}

class GroupForm extends React.Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state } = navigation;
        if (state.params.update) {
            return {
                tabBarVisible: false,
                headerTitle: `${navigation.state.params.group.name}`,
                headerStyle: { 'backgroundColor': '#4B9382' }
            };
        } else {
            return {
                tabBarVisible: false,
                header: null
            };
        }
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        this.state = {
            group: navParams.group ? navParams.group : {
                name: ''
            } as Group,
            personArray: [] as PersonList,
            groupArray: navParams.groupArray,
            currencies: {} as Currencies,
            update: navParams.update
        };
    }

    render() {
        const { goBack, dispatch } = this.props.navigation;
        let members: ReactNode[] = new Array();
        let personArray = this.state.personArray;

        personArray.map((person: Person, key: any) => {
            console.log(person);
            members.push(
                <InputWithoutLabel
                    key={person.id}
                    returnKeyType={'done'}
                    autoCapitalize={'words'}
                    value={person.firstname + ' ' + person.lastname}
                    editable={false}
                />
            );
        });

        let height = Dimensions.get('window').height;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.flex}>
                    <Text style={styles.title}>{this.state.update ? 'Update Group' : 'New Group'}</Text>
                </View>

                <KeyboardAvoidingView behavior='padding'>
                    <InputWithoutLabel
                        inputref={(input: any) => { (this as any).groupName = input; }}
                        placeholder={'Group name'}
                        autoCapitalize={'sentences'}
                        value={this.state.group.name}
                        onChangeText={(text: string) => {
                            const group = Object.assign({}, this.state.group, { name: text });
                            this.setState({ group });
                        }}
                        onSubmitEditing={() => (this as any).newMember.focus()}
                        returnKeyType={'next'}
                    />
                    <Text> Current Members ({members.length}) </Text>
                    <ScrollView style={{ height: height * 0.3 }}>
                        {members}
                    </ScrollView>
                    <Text> Add Members: </Text>
                    <InputWithoutLabel
                        inputref={(input: any) => { (this as any).newMember = input; }}
                        placeholder={'Firstname Lastname'}
                        returnKeyType={'done'}
                        autoCapitalize={'words'}
                        onSubmitEditing={(text: any) => {
                            this.addPerson(text.nativeEvent.text);
                        }}
                    />
                </KeyboardAvoidingView>

                <GreenButton buttonText={this.state.update ? 'DELETE' : 'BACK'} onPress={() => {
                    if (this.state.update) {
                        this.delete(dispatch);
                    } else {
                        goBack();
                    }
                }} />
                <GreenButton buttonText={'SAVE'} onPress={() => this.validate(goBack)} />
            </View>
        );
    }

    save(goBack: any) {
        let id = (this.state.update) ? this.state.group.id : this.state.group.name + '#' + new Date().toISOString();
        if (this.state.update) {
            for (let i = 0; i < this.state.groupArray.length; i++) {
                if (this.state.groupArray[i].id === this.state.group.id) {
                    this.state.groupArray[i] = this.state.group;
                }
            }
        } else {
            this.state.groupArray.push({
                'id': id,
                'name': this.state.group.name,
                'defaultCurrencies': this.state.group.defaultCurrencies
            });
        }

        this.updateStorage(id)
            .then(() => {
                goBack();
                if (!this.state.update) {
                    this.props.navigation.state.params.updateFeedState({ groupArray: this.state.groupArray });
                }
            });
    }

    delete(dispatch: any) {
        for (let i = 0; i < this.state.groupArray.length; i++) {
            if (this.state.groupArray[i].id === this.state.group.id) {
                this.state.groupArray.splice(i, 1);
            }
        }

        this.deleteStorage(this.state.group.id)
            .then(() => {
                dispatch(reset('GroupFeed'));
            });
    }

    validate(navigate: any) {
        let error = '';
        if (this.state.group.name === undefined || this.state.group.name === '') {
            error += 'Group name can not be empty';
        }

        if (this.state.personArray.length <= 0) {
            error += '\nThere must be at least one person inside a group';
        }

        if (error === '') {
            this.save(navigate);
        } else {
            this.showError(error);
        }
    }

    createPerson(text: string) {
        let firstname = text.split(' ')[0];
        let lastname = text.split(' ').slice(1).join(' ') || '';
        let person = {
            firstname: firstname,
            lastname: lastname,
            id: firstname + lastname,
            balance: 0
        } as Person;
        return person;
    }

    updatePerson(text: string, key: any) {
        console.log(text);
        console.log(key);
        let personArray = [...this.state.personArray];
        if (text !== '') {
            personArray[key] = this.createPerson(text);
        } else {
            personArray.splice(key, 1);
        }
        this.setState({ personArray }, () =>
            console.log(this.state.personArray)
        );
    }

    addPerson(text: string) {
        if (text !== '') {
            let person = this.createPerson(text);
            let personArray = [...this.state.personArray];
            if (!personArray.find(function (obj: Person) { return obj.id === person.id; })) {
                personArray.push(person);
                this.setState({ personArray });
                (this as any).newMember.clear();
            } else {
                this.showError('Person already inside group');
            }
        }
    }

    async updateStorage(id: string) {
        try {
            await AsyncStorage.multiSet([
                ['groups', JSON.stringify(this.state.groupArray)],
                ['persons-' + id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            this.showError(error);
        }
    }

    async deleteStorage(id: string) {
        try {
            await AsyncStorage.multiSet([
                ['groups', JSON.stringify(this.state.groupArray)],
                ['persons-' + id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            this.showError(error);
        }
    }

    showError(error: string) {
        Alert.alert('Warning', error,
            [
                { text: 'OK', onPress: () => { return false; } }
            ],
            { onDismiss: () => undefined }
        );
        return true;
    }

    componentWillMount() {
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

        if (this.state.update) {
            AsyncStorage.getItem('persons-' + this.state.group.id)
                .then((value) => {
                    if (value) {
                        this.setState({
                            personArray: JSON.parse(value)
                        });
                    }
                });
        }
    }
}

export default GroupForm;

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
