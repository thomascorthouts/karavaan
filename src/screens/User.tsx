import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { UserForm } from '../../src/components/Userform';

class UserScreen extends React.Component<IDefaultNavProps, {}> {
    constructor(props: IDefaultNavProps) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <UserForm navigation={this.props.navigation}/>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
export default UserScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B9382',
        alignSelf: 'stretch'
    }
});