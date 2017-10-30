import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class LoginForm extends React.Component {
    render() {
        return (<View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../images/Karavaan.png')} />
            </View>
            <View style={styles.formContainer}/>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B9382'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    logo: {
        width: 200,
        height: 200
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        width: 160
    }
});
