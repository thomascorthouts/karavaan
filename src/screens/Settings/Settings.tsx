import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';

class Settings extends React.Component<IDefaultNavProps, {}> {

    constructor(props: IDefaultNavProps) {
        super(props);

        this.state = {
            personArray: [] as PersonList
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <View style={styles.flex}>
                    <Text style={styles.title}>Settings</Text>
                </View>
                <GreenButton buttonText={'Update Member Suggestions'} onPress={() => {
                    navigate('UpdateMemberSuggestions');
                }}/>
            </View>
        );
    }
}

export default Settings;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#4B9382'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});