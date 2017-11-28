import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, AppRegistry, FlexStyle, TextInput, TouchableOpacity, StatusBar, Button, ListView, Picker, Alert, AsyncStorage } from 'react-native';
import { GroupForm } from '../../components/GroupForm';

class AddGroupScreen extends React.Component<IDefaultNavProps, IAddGroupState> {

    constructor(props: IDefaultNavProps, state: IAddGroupState) {
        super(props, state);
        let dat = new Date();
        this.state = {
            name: '',
            date: dat.getDate + '/' + dat.getMonth + '/' + dat.getFullYear,
            personArray: [] as PersonList,
            groupArray: [] as GroupList
            // group: {name: '', date: new Date(), personArray: [] as PersonList},
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                <View style={styles.formcontainer}>
                <StatusBar barStyle={'light-content'} />
               
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../../images/Karavaan.png')} />
                </View>
               
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Group name'}
                    onChangeText={(text) => this.setState({name:text})}
                    returnKeyType={'next'}
                />
          
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    value={this.state.date}
                    onChangeText={(text) => this.setState({date:text})}
                    returnKeyType={'next'}
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save()}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => {this._handlePress(), this.save()}} >
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

            </View>
                </KeyboardAvoidingView>
            </View>
        );
    }

    save() {
        this.props.navigation.navigate('Groups');
        
    }

    _handlePress() {
        console.log(this.state.name);
        console.log(this.state.date);
        this.addGroupToStorage();
        this.save();
     }


     async addGroupToStorage(){
         try{
             AsyncStorage.getItem('groups') 
                .then((value) => {
                    if(value !== null) {
                        // Hoe dit doen zonder variabele grouplijst in state?
                        this.setState({
                            groupArray: JSON.parse(value)
                        });
                    }
                })
                this.state.groupArray.push({'name': this.state.name, 'date': this.state.date, 'personArray': this.state.personArray})
                await AsyncStorage.setItem('groups', JSON.stringify(this.state.groupArray))
         } catch (error) {
             //TODO
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
            picker:{
             
                width:'100%'
            },
            inputAmount: {
                flexDirection: 'row',
                alignItems: 'center',
                width:'100%',
                height: 41,
                backgroundColor: 'rgba(255,255,255,0.2)',
                marginBottom: 10,
                color: '#FFF',
                paddingHorizontal: 10
            },
            buttonContainer: {
                backgroundColor: '#287E6F',
                paddingVertical: 15,
                marginBottom: 10,
        
        
        
            },
            buttonText: {
                textAlign: 'center',
                color: '#FFFFFF'
            },
            logoContainer: {
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1
            },
            logo: {
                width: 200,
                height: 200
            }
});