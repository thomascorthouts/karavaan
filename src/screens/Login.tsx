import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, StatusBar, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { textInputStyles } from '../components/TextInput/styles';

class LoginScreen extends React.Component<IDefaultNavProps, {}> {
    constructor(props: IDefaultNavProps) {
        super(props);
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../images/Karavaan.png')} />
                </View>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.formContainer}>
                        <StatusBar barStyle={'light-content'} />

                        <InputWithoutLabel
                            placeholder={'Username'}
                            returnKeyType={'next'}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onSubmitEditing={() => (this as any).passwordInput.focus()}
                        />

                        <InputWithoutLabel
                            secureTextEntry
                            placeholder={'Password'}
                            returnKeyType={'go'}
                            inputref={(input: any) => {(this as any).passwordInput = input;}}
                            onSubmitEditing={() => this.login(navigate)}
                        />

                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.login(navigate)}>
                            <Text style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }

    login(navigate: any) {
        navigate('Home');
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    },
    formContainer: {
        padding: 20,
        flex: 0
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
