import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { InputWithoutLabel } from './TextInput/InputWithoutLabel';
import { Container } from './Container';
import { textStyles } from './TextInput/styles';

export class LoginForm extends React.Component<IDefaultNavProps, {}> {
    constructor(props: IDefaultNavProps) {
        super(props);
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <Container padding={20}>
                <StatusBar barStyle={'light-content'} />
                
                <InputWithoutLabel
                    placeholder={'Username'}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onSubmitEditing={() => (this as any).passwordInput.focus()}
                />

                <TextInput
                    style={textStyles.input}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry
                    placeholder={'Password'}
                    returnKeyType={'go'}
                    ref={(input) => (this as any).passwordInput = input}
                    onSubmitEditing={() => this.login(navigate)}
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.login(navigate)}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </Container>
        );
    }

    login(navigate: any) {
        navigate('Home');
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#287E6F',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF'
    }
});
