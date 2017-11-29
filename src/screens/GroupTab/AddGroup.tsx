import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';
import { GroupForm } from '../../components/GroupForm';

interface IState {
    group: Group;
    groupArray: GroupList;
}

class AddGroupScreen extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let dat = new Date();
        this.state = {
            group: {
                name: '',
                date: dat.getDate() + '/' + (dat.getMonth() + 1) + '/' + dat.getFullYear(),
                personArray: [] as PersonList,
                expenseArray: [] as ExpenseList
            },
            groupArray: [] as GroupList
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.formcontainer}>
                        <StatusBar barStyle={'light-content'} />

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

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.back(navigate)}>
                            <Text style={styles.buttonText}>BACK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }

    back(navigate: any) {
        navigate('GroupFeed');
    }

    save(navigate: any) {
        this.addGroupToStorage()
            .then(() => {
                navigate('GroupFeed', { groupArray: this.state.groupArray });
            });
    }

    async addGroupToStorage() {
        try {
            this.state.groupArray.push({
                'name': this.state.group.name,
                'date': this.state.group.date,
                'personArray': this.state.group.personArray,
                'expenseArray': []
            });

            await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray));
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('groups')
            .then((value) => {
                if (value) {
                    this.setState({
                        groupArray: JSON.parse(value)
                    });
                } else {
                    this.setState({
                        groupArray: []
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