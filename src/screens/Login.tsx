import React from 'react';
import { StyleSheet, View, Image, StatusBar, KeyboardAvoidingView } from 'react-native';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { resetState } from '../utils/navigationactions';
import { GreenButton } from '../components/Buttons/GreenButton';

class LoginScreen extends React.Component<IDefaultNavProps, {}> {
    constructor(props: IDefaultNavProps) {
        super(props);
    }

    render() {
        const { dispatch } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
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
                            inputref={(input: any) => (this as any).passwordInput = input}
                            onSubmitEditing={() => this.login(dispatch)}
                        />

                        <GreenButton buttonText={'LOGIN'} onPress={() => this.login(dispatch)}/>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }

    login(dispatch: any) {
        resetState('Home', dispatch);
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
    }
});
