import React, { Component } from 'react';
import { AppRegistry, FlexStyle, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, Button, ListView, Picker, Alert } from 'react-native';

export class GroupForm extends Component<IDefaultNavProps, any> {

    state = {
        name: '',
        date: '',
        personArray: [] as PersonList
    };

    constructor(props: IDefaultNavProps) {
        super(props);
    }

    _handlePress() {
        console.log(this.state.name);
        console.log(this.state.date);
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />

                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../../images/Karavaan.png')} />
                </View>

                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Group name'}
                    onChangeText={(text) => this.setState({ name: text })}
                    returnKeyType={'next'}
                />

                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Date'}
                    onChangeText={(text) => this.setState({ date: text })}
                    returnKeyType={'next'}
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.back(navigate)}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.save(navigate)} >
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    back(navigate: any) {
        this._handlePress();
        navigate('Home');
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
    picker: {
        width: '100%'
    },
    inputAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 41,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#287E6F',
        paddingVertical: 15,
        marginBottom: 10
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