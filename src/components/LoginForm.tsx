import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export class LoginForm extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                />
                <TextInput
                    style={styles.input}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        height: 40,
        backgroundColor: 'black',
        fontSize: 19
    }
});
