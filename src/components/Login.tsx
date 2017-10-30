import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';

import { LoginForm } from '../../src/components/LoginForm';

export class Login extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../images/Karavaan.png')} />
                </View>
                <KeyboardAvoidingView behavior='padding'>
                    <LoginForm />
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B9382',
        alignSelf: 'stretch'
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
