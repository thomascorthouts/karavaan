import React, {Component, ReactNode} from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';

interface IState {
    group: Group;
    error: string;
    groupArray: GroupList;
}
//Geeft foutmelding want nog groupArray meekrijgen
//AddGroupToStorage moet nog aangepast worden

class GroupDetail extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: {navigation: any}) => ({
        headerTitle: `${navigation.state.params.group.name}`
    });

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);
        this.state = {
            group: this.props.navigation.state.params.group,
            error: '',
            groupArray: this.props.navigation.state.params.groupArray,
        };
    }
    
    render() {
        const { navigate } = this.props.navigation;
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
                                    this.addPerson(text.nativeEvent.text);
                                }
                            }
                        />

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate()}>
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.validate(navigate)}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                        <Text style={styles.errorText}>{this.state.error}</Text>

                    </View>
                </KeyboardAvoidingView>
            </View>

        );}

        save(navigate: any) {
            let nr = this.state.groupArray.length;
            console.log(nr);
            this.addGroupToStorage()
                .then(() => {
                    navigate('GroupFeed', {groupArray: this.state.groupArray});
                });
        }
    
        validate(navigate: any){
            if (this.state.group.date === '' || this.state.group.name === '' || this.state.group.personArray.length === 0){
                this.setState( {error: 'No field can be empty'})
            } else {
                this.save(navigate);
            }
        }
    
        updatePerson(person: string, key: any){
            this.state.group.personArray[key] = person;
            const group = this.state.group;
            this.setState({ group: group});
        }
    
        addPerson(name: string) {
            this.state.group.personArray.push(name);
            const group = this.state.group;
            this.setState({group: group});
        }
    
        async addGroupToStorage() {
            try {
                console.log('in addGroup');
                let nr = this.state.groupArray.length;
                for (let i = 0; i < nr; i++){
                    if (this.state.groupArray[i].groupId === this.state.group.groupId){
                       this.state.groupArray[i] = this.state.group;
                    }
                }
                await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray));
            } catch (error) {
                console.log(error);
            }
        }
                    }

export default GroupDetail;

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