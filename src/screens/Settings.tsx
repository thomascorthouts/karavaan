import React, { Component } from 'react';
import { ScrollView, Text, StatusBar } from 'react-native';
import { ColumnContainer } from '../components/Container/ColumnContainer';

class Settings extends Component {
    render() {
        return (
            <ColumnContainer>
                <StatusBar translucent={false} barStyle='light-content' />
                <Text>TODO</Text>
            </ColumnContainer>
        );
    }
}

export default Settings;
