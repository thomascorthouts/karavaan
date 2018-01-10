import React from 'react';
import { View, Image, StatusBar, KeyboardAvoidingView } from 'react-native';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { resetState } from '../utils/navigationactions';
import { GreenButton } from '../components/Buttons/GreenButton';
import { specificStyles, standardStyles, backgroundColorStyles } from './screenStyles';

class LoginScreen extends React.Component<IDefaultNavProps, {}> {

    constructor(props: IDefaultNavProps) {
        super(props);
    }

    render() {
        const { dispatch } = this.props.navigation;

        return (
            <View style={ [specificStyles.container, backgroundColorStyles.lightGreen] }>
                <StatusBar hidden={true} />
                <View style={ [standardStyles.center, { flexGrow: 1 } ]}>
                    <Image style={specificStyles.logo} source={require('../../../images/Karavaan.png')} />
                </View>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={[ standardStyles.noFlex, { padding: 15}]}>
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

                        <GreenButton buttonText={'LOGIN'} onPress={() => this.login(dispatch)} />
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