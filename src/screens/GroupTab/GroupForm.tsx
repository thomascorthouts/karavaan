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
import { DeleteButton } from '../../components/Buttons/DeleteButton';
import * as StringSimilarity from '../../similarity';

interface IState {
    group: Group;
    groupArray: GroupList;
    personArray: PersonList; // persons in this group
    allPersonsArray: PersonList; // All persons ever added to a group
    currencies: Currencies;
    memberSuggestion: string;
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
                name: '',
                defaultCurrencies: [] as Array<string>
            } as Group,
            personArray: [] as PersonList,
            allPersonsArray: [] as PersonList,
            memberSuggestion: '',
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
            members.push(
                <View key={person.id} style={styles.rowContainer}>
                    <View style={styles.currentMembers}>
                        <InputWithoutLabel
                            returnKeyType={'done'}
                            autoCapitalize={'words'}
                            value={person.firstname + ' ' + person.lastname}
                            editable={false}
                        />
                    </View>
                    <View style={styles.flex}>
                        <DeleteButton
                            buttonText={'X'}
                            buttonStyle={styles.deleteButton}
                            onPress={() =>
                                this.confirmDelete(person.firstname + ' ' + person.lastname, () => this.deletePerson(key))
                            }/>
                    </View>
                </View>
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
                    <ScrollView style={{ height: height * 0.2 }}>
                        {members}
                    </ScrollView>
                    <Text> Add Members: </Text>
                    <InputWithoutLabel
                        inputref={(input: any) => { (this as any).newMember = input; }}
                        placeholder={'Firstname Lastname'}
                        returnKeyType={'done'}
                        autoCapitalize={'words'}
                        suggestion={this.state.memberSuggestion}
                        suggestionPress={() => this.selectSuggestion()}
                        onBlur={() => this.setState({memberSuggestion: ''})}
                        onChangeText={(text: string) => {
                            this.findSuggestion(text);
                        }}
                        onSubmitEditing={(text: any) => {
                            this.addPerson(text.nativeEvent.text);
                        }}
                    />
                    <CurrencyInputPicker chooseCurrency={this.addDefaultCurrency.bind(this)} currencyList={this.state.currencies}/>
                    <Text>{this.state.group.defaultCurrencies}</Text>
                </KeyboardAvoidingView>

                <GreenButton buttonText={this.state.update ? 'DELETE' : 'BACK'} onPress={() => {
                    if (this.state.update) {
                        this.confirmDelete('this group', () => this.deleteGroup(dispatch));
                    } else {
                        goBack();
                    }
                }} />
                <GreenButton buttonText={'SAVE'} onPress={() => this.validateGroup(goBack)} />
            </View>
        );
    }

    addDefaultCurrency(tag: string) {
        let group = this.state.group;
        group.defaultCurrencies.push(tag);
        this.setState({group});
    }

    findSuggestion(text: string) {
        let bestSuggestion = StringSimilarity.findBestMatch(text, this.state.allPersonsArray.map(a => a.firstname + ' ' + a.lastname));
        if (!this.state.personArray.find(function (obj: Person) { return obj.firstname + ' ' + obj.lastname === bestSuggestion; })) {
            this.setState({memberSuggestion: bestSuggestion});
        }
    }

    selectSuggestion() {
        (this as any).newMember.setNativeProps({text: this.state.memberSuggestion});
        this.setState({memberSuggestion: ''});
    }

    saveGroup(goBack: any) {
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

    deleteGroup(dispatch: any) {
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

    validateGroup(navigate: any) {
        let error = '';
        if (this.state.group.name === undefined || this.state.group.name === '') {
            error += 'Group name can not be empty';
        }

        if (this.state.personArray.length <= 0) {
            error += '\nThere must be at least one person inside a group';
        }

        if (error === '') {
            this.saveGroup(navigate);
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

    deletePerson(key: any) {
        let personArray = [...this.state.personArray];
        personArray.splice(key, 1);

        this.setState({ personArray });
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

            let allPersonsArray = [...this.state.allPersonsArray];
            if (!allPersonsArray.find(function (obj: Person) { return obj.id === person.id; })) {
                allPersonsArray.push(person);
                this.setState({ allPersonsArray });
            }
        }
    }

    async updateStorage(id: string) {
        try {
            await AsyncStorage.multiSet([
                ['groups', JSON.stringify(this.state.groupArray)],
                ['persons', JSON.stringify(this.state.allPersonsArray)],
                ['persons-' + id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            this.showError(error);
        }
    }

    async deleteStorage(id: string) {
        try {
            await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray));
            await AsyncStorage.removeItem('persons-' + id);
        } catch (error) {
            this.showError(error);
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

    confirmDelete(type: string, callback: any) {
        Alert.alert('Warning', 'Do you really want to delete ' + type,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => callback() }
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

        AsyncStorage.getItem('persons')
            .then((value) => {
                if (value) {
                    this.setState({
                        allPersonsArray: JSON.parse(value)
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
    rowContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    currentMembers: {
        flex: 3
    },
    deleteButton: {
        height: 40,
        paddingVertical: 10
    }
});
