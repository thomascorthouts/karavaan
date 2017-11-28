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
            error: ''
          }
          
    }
     
    _handlePress(nav : any) {
        if(this.state.firstname == '' || this.state.lastname == '' || this.state.amount == '')
        {
            this.setState({error : 'Please fill out all fields'});
            console.log("error:" + this.state.error);
            
            
        }
        
        else{
            this.save(nav);
        // Do something here which you want to if all the Text Input is filled.
         
        }
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

                <Text style={styles.title}> Form</Text>
                <Text style={styles.errorStyle}> {this.state.error} </Text>
               
               
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
                    onChangeText={(number) => this.setState({amount:number})}
                    returnKeyType={'go'}

                />
               
               

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this._handlePress(navigate)} >
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
   title:{
    fontSize:40,
    color:'#287E6F',
    fontWeight: 'bold',
    textAlign: 'center'
    
   },
   
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
errorStyle:{
    
    padding: 20,
    color: 'red',
    paddingHorizontal: 10,
    marginBottom: 10
}
    ,
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
