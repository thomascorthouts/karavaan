import React, { ReactNode } from 'react';
import { View, Text, StatusBar, AsyncStorage, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { InputWithoutLabel } from '../../components/TextInput/InputWithoutLabel';
import { DeleteButton } from '../../components/Buttons/DeleteButton';
import { showError, confirmDelete } from '../../utils/popup';
import {specificStyles, standardStyles} from '../screenStyles';

interface IState {
    personArray: PersonList;
}

class UpdateMemberSuggestions extends React.Component<IDefaultNavProps, IState> {

    static navigationOptions = () => {
        return {
            headerTitle: 'Settings',
            headerStyle: { 'backgroundColor': '#4B9382' }
        };
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            personArray: [] as PersonList
        };
    }

    render() {
        let members: ReactNode[] = [];
        let personArray = this.state.personArray;

        personArray.map((person: Person, key: any) => {
            members.push(
                <View key={person.id} style={ standardStyles.rowContainer }>
                    <View style={ standardStyles.tripleFlex }>
                        <InputWithoutLabel
                            returnKeyType={'done'}
                            autoCapitalize={'words'}
                            value={person.firstname + ' ' + person.lastname}
                            editable={false}
                        />
                    </View>
                    <View style={ standardStyles.flex }>
                        <DeleteButton
                            buttonText={'X'}
                            buttonStyle={ specificStyles.deleteButton }
                            onPress={() =>
                                confirmDelete(person.firstname + ' ' + person.lastname, () => this.deletePerson(key))
                            } />
                    </View>
                </View>
            );
        });

        let height = Dimensions.get('window').height;

        return (
            <View style={ specificStyles.container }>
                <StatusBar hidden={true} />
                <View style={ standardStyles.flex }>
                    <Text style={ specificStyles.title }>Update Member Suggestions</Text>
                </View>
                <KeyboardAvoidingView>
                    <Text> Add Suggestions: </Text>
                    <InputWithoutLabel
                        inputref={(input: any) => { (this as any).newMember = input; }}
                        placeholder={'Firstname Lastname'}
                        returnKeyType={'done'}
                        autoCapitalize={'words'}
                        onSubmitEditing={(text: any) => {
                            this.addPerson(text.nativeEvent.text);
                        }}
                    />
                    <Text> Current Suggestions ({members.length}) </Text>
                    <ScrollView style={{ height: height * 0.5 }}>
                        {members}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    addPerson(text: string) {
        if (text !== '') {
            let person = this.createPerson(text);
            let personArray = [...this.state.personArray];
            if (!personArray.find(function (obj: Person) { return obj.id === person.id; })) {
                personArray.push(person);
                this.setState({ personArray }, () => this.updateStorage());
                (this as any).newMember.clear();
            } else {
                showError('Person already inside memberlist');
            }
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

        this.setState({ personArray }, () => this.updateStorage());
    }

    async updateStorage() {
        try {
            await AsyncStorage.setItem(
                'persons', JSON.stringify(this.state.personArray)
            );
        } catch (error) {
            showError(error);
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('persons')
            .then((value) => {
                if (value) {
                    this.setState({
                        personArray: JSON.parse(value)
                    });
                }
            });
    }
}

export default UpdateMemberSuggestions;