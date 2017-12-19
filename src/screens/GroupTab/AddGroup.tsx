import React, {ReactNode} from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';

interface IState {
    group: Group;
    groupArray: GroupList;
    nextKey: any;
    error: string;
}

// aanpassingen: 
    //personmap i.p.v. personarray (voor update methode)
    //nextkey mss op andere manier
    //veld clearen na member toe te voegen

class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);
        let dat = new Date();
        this.state = {
            group: {
                name: '',
                date: dat.getDate() + '/' + (dat.getMonth() + 1) + '/' + dat.getFullYear(),
                personArray: [] as PersonList,
                expenseArrayId: '',
            },
            groupArray: this.props.navigation.state.params.groupArray,
            nextKey: 0,
            error: ''
        };
    }

    render() {
        const { goBack } = this.props.navigation;
        let members: ReactNode[] = new Array();
        const personArray = this.state.group.personArray;
        const num = personArray.map((person: Person) => {
             members.push(<TextInput style={styles.input} returnKeyType={'next'} autoCapitalize={'words'} 
             value={person.name} onChangeText={(text) =>  
                 {
                 this.updatePerson(person, text);}}/>)
        });


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
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={'new member'}
                            returnKeyType={'next'} 
                            autoCapitalize={'words'} 
                            onSubmitEditing={(text) => {
                                    this.addPerson(this.state.nextKey, text.nativeEvent.text);
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

    validate(navigate: any){
        if (this.state.group.date === '' || this.state.group.name === '' || this.state.group.personArray.length === 0){
            this.setState( {error: 'Please fill out all fields'})
        } else {
            this.save(navigate);
        }
    }

    updatePerson(person: Person, name: string){
        for (let i = 0; i < this.state.group.personArray.length; i++){
            if (this.state.group.personArray[i].key === person.key){
                this.state.group.personArray[i].name = name;
            }
        }
        const group = this.state.group;
        this.setState({ group: group});
    }

    addPerson(key: any, name: string) {
        this.state.group.personArray.push({key: key, name: name});
        
        const group = this.state.group;
        const k = key + 1;
        this.setState({nextKey: k});
        this.setState({group: group});
    }

    async addGroupToStorage() {
        try {
            this.state.groupArray.push({
                'name': this.state.group.name,
                'date': this.state.group.date,
                'personArray': this.state.group.personArray,
                'expenseArrayId': this.state.group.name + '#' + new Date().toISOString()
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
    },
    errorText: {
        color: 'red'
    }
});