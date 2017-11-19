import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';

export class UserForm extends React.Component<IDefaultNavProps, {}> {
        constructor(props: IDefaultNavProps) {
        super(props);
    }

    render(){
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
           
            <TextInput
                style={styles.input}
                underlineColorAndroid={'transparent'}
                placeholder={'Firstname'}
                returnKeyType={'next'}
                autoCapitalize={'none'}
                autoCorrect={false}
               
            />

                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry
                    placeholder={'Lastname'}
                    returnKeyType={'go'}  
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)}>
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
    buttonContainer: {
        backgroundColor: '#287E6F',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF'
    }
});
