import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';

export class LoginForm extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Username'}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onSubmitEditing={() => (this as any).passwordInput.focus() }
                />

                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry
                    placeholder={'Password'}
                    returnKeyType={'go'}
                    ref={(input) => (this as any).passwordInput = input}
                />

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
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
