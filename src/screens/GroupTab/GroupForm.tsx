import React, { ReactNode } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, AsyncStorage, Dimensions, StatusBar } from 'react-native';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { _currencies } from '../../config/Data';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { resetState } from '../../utils/navigationactions';
import { DeleteButton } from '../../components/Buttons/DeleteButton';
import { showError, confirmDelete } from '../../utils/popup';
import { backgroundColorStyles, specificStyles, standardStyles } from '../screenStyles';

interface IState {
    group: Group;
    groupArray: GroupList;
    personArray: PersonList; // persons in this group
    allPersonsArray: PersonList; // All persons ever added to a group
    currencies: Currencies;
    update: boolean;
}

class GroupForm extends React.Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: { navigation: any }) => {
        const { state } = navigation;
        if (state.params.update) {
            return {
                tabBarVisible: false,
                headerTitle: `Update ${navigation.state.params.group.name}`,
                headerStyle: backgroundColorStyles.lightGreen
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
                defaultCurrency: {
                    name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
                } as Currency,
                currencies: {} as Currencies
            } as Group,
            personArray: [] as PersonList,
            allPersonsArray: [] as PersonList,
            groupArray: navParams.groupArray,
            currencies: _currencies,
            update: navParams.update
        };
    }

    render() {
        let { height } = Dimensions.get('window');
        const { goBack, dispatch, navigate } = this.props.navigation;

        let members: ReactNode[] = [];
        let personArray = this.state.personArray;

        personArray.map((person: Person, key: any) => {
            members.push(
                <View key={person.id} style={standardStyles.rowContainer}>
                    <View style={standardStyles.tripleFlex}>
                        <InputWithoutLabel
                            returnKeyType={'done'}
                            autoCapitalize={'words'}
                            value={person.firstname + ' ' + person.lastname}
                            editable={false}
                        />
                    </View>
                    <View style={standardStyles.flex}>
                        <DeleteButton
                            buttonText={'X'}
                            buttonStyle={specificStyles.deleteButton}
                            onPress={() =>
                                confirmDelete(person.firstname + ' ' + person.lastname, () => this.deletePerson(key))
                            } />
                    </View>
                </View>
            );
        });

        return (
            <View style={specificStyles.container}>
                <StatusBar hidden={true} />
                <View style={standardStyles.flex}>
                    <Text style={specificStyles.title}>{this.state.update ? '' : 'New Group'}</Text>
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
                        inputref={(input: any) => (this as any).newMember = input}
                        placeholder={'Firstname Lastname'}
                        returnKeyType={'done'}
                        autoCapitalize={'words'}
                        options={this.state.allPersonsArray.map(a => a.firstname + ' ' + a.lastname)}
                        onSubmitEditing={(text: any) => this.addPerson(text.nativeEvent.text)}
                        clearOnBlur={true}
                    />

                    <Text> Default Currency: </Text>
                    <CurrencyPicker
                        currencies={this.state.currencies}
                        onValueChange={(text: string) => {
                            const group = Object.assign({}, this.state.group, { defaultCurrency: text });
                            this.setState({ group });
                        }}
                        selectedValue={this.state.group.defaultCurrency}
                    />
                </KeyboardAvoidingView>

                <GreenButton buttonText={'Select Currencies'} onPress={() => {
                    navigate('GroupCurrencies', {
                        currencies: Object.assign({}, this.state.currencies),
                        selected: Object.assign({}, this.state.group.currencies),
                        default: Object.assign({}, this.state.group.defaultCurrency),
                        setGroupCurrencies: this.setDefaultCurrencies.bind(this)
                    });
                }} />

                <View style={ standardStyles.rowContainer }>
                    <View style={ standardStyles.flex }>
                        <GreenButton buttonStyle={ specificStyles.leftButton } buttonText={this.state.update ? 'DELETE' : 'BACK'} onPress={() => {
                            if (this.state.update) {
                                confirmDelete('this group', () => this.deleteGroup(dispatch));
                            } else {
                                goBack();
                            }
                        }} />
                    </View>
                    <View style={standardStyles.flex}>
                        <GreenButton buttonStyle={ specificStyles.rightButton } buttonText={'SAVE'} onPress={() => this.validateGroup(dispatch)} />
                    </View>
                </View>
            </View>
        );
    }

    setDefaultCurrencies(currencies: Currencies) {
        const group = Object.assign({}, this.state.group, { currencies: currencies });
        this.setState({ group });
    }

    saveGroup(dispatch: any) {
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
                'defaultCurrency': this.state.group.defaultCurrency,
                'currencies': this.state.group.currencies
            });
        }

        this.updateStorage(id)
            .then(() => {
                resetState('GroupFeed', dispatch);
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
                resetState('GroupFeed', dispatch);
            });
    }

    validateGroup(dispatch: any) {
        let error = '';
        if (this.state.group.name === undefined || this.state.group.name === '') {
            error += 'Group name can not be empty';
        }

        if (this.state.personArray.length <= 1) {
            error += '\nThere must be at least two persons inside a group';
        }

        if (error === '') {
            this.saveGroup(dispatch);
        } else {
            showError(error);
        }
    }

    createPerson(text: string) {
        let firstname = text.split(' ')[0].trim();
        let lastname = text.split(' ').slice(1).join(' ').trim() || '';
        return {
            firstname: firstname,
            lastname: lastname,
            id: firstname + lastname,
            balance: 0
        } as Person;
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
                showError('Person already inside group');
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
            if (Object.getOwnPropertyNames(this.state.group.currencies).length === 0) {
                this.state.group.currencies[this.state.group.defaultCurrency.tag] = this.state.group.defaultCurrency;
            }
            await AsyncStorage.multiSet([
                ['groups', JSON.stringify(this.state.groupArray)],
                ['persons', JSON.stringify(this.state.allPersonsArray)],
                ['persons-' + id, JSON.stringify(this.state.personArray)]
            ]);
        } catch (error) {
            showError(error);
        }
    }

    async deleteStorage(id: string) {
        try {
            await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray));
            await AsyncStorage.removeItem('persons-' + id);
            await AsyncStorage.removeItem('expenses-' + id);
        } catch (error) {
            showError(error);
        }
    }

    async componentDidMount() {
        let group = this.state.group;
        if (!this.state.update) {
            group = await AsyncStorage.getItem('defaultCurrency')
                .then((value) => {
                    if (value) {
                        return Object.assign({}, this.state.group, { defaultCurrency: JSON.parse(value) });
                    } else {
                        return this.state.group;
                    }
                });
        }

        let allPersonsArray = await AsyncStorage.getItem('persons')
            .then((value) => {
                if (value) {
                    return JSON.parse(value);
                } else {
                    return this.state.allPersonsArray;
                }
            });

        let personArray = this.state.personArray;
        if (this.state.update) {
            personArray = await AsyncStorage.getItem('persons-' + this.state.group.id)
                .then((value) => {
                    if (value) {
                        return JSON.parse(value);
                    } else {
                        return this.state.personArray;
                    }
                });
        }

        this.setState({ group, personArray, allPersonsArray });
    }
}

export default GroupForm;