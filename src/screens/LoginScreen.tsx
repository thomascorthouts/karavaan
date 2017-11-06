import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';

import { LoginForm } from '../../src/components/LoginForm';

export class LoginScreen extends React.Component<ILoginProps, {}> {
    constructor(props: ILoginProps) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../images/Karavaan.png')} />
                </View>
                <KeyboardAvoidingView behavior='padding'>
                    <LoginForm navigation={this.props.navigation}/>
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
