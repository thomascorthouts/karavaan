import React, { Component } from 'react';
import { AppRegistry, FlexStyle, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, Button, ListView, Picker, Alert } from 'react-native';
import Form from 'react-form';



export class UserForm extends Component<IDefaultNavProps, any> {

    constructor(props: IDefaultNavProps) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            itemValue: '',
            amount: '',
          }
    }

    _handlePress() {
        console.log(this.state.firstname);
        console.log(this.state.lastname);
        console.log(this.state.itemValue );
        console.log(this.state.amount);
     }
   

    render() {
        const { navigate } = this.props.navigation;
        const values = ['1', '2'];
        const optionsGender = ['Male', 'Female']
        const currencies = [
            'CAD',          // Canadian Dollar
            'EUR',          // Euro
            'GBP',          // British Pound
            'USD',          // US Dollar
        ];
        return (


            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />
               
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../images/Karavaan.png')} />
                </View>
               
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Firstname'}
                    onChangeText={(text) => this.setState({firstname:text})}
                    returnKeyType={'next'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                />
          
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Lastname'}
                    onChangeText={(text) => this.setState({lastname:text})}
                    returnKeyType={'next'}
                />
                
                <Picker
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
                    <Picker.Item label="EUR / €" value="EUR" />
                    <Picker.Item label="CAD / C$" value="CAD" />
                    <Picker.Item label="GBP / £" value="GBP" />
                    <Picker.Item label="USD / $" value="USD" />
                </Picker>
                
                <TextInput
                
                    keyboardType={'numeric'}
                    style={styles.inputAmount}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Amount'}
                    onChangeText={(text) => this.setState({amount:text})}
                    returnKeyType={'go'}

                />
               
               

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this._handlePress()}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

            </View>
        );
    }

    

    save(navigate: any) {
        navigate('Home');
    }


}

const styles = StyleSheet.create({
    container: {

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
