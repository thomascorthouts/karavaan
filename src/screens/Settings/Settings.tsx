import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, AsyncStorage } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { currencies } from '../../config/Data';

interface IState {
    currencies: Currencies;
    defaultCurrency: Currency;
}

class Settings extends React.Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            currencies: currencies,
            defaultCurrency: {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            } as Currency
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
                <View style={styles.flex}>
                    <Text>Default Currency:</Text>

                    <CurrencyPicker
                        currencies={this.state.currencies}
                        onValueChange={(currency: Currency) => this.saveDefaultCurrency(currency)}
                        selectedValue={this.state.defaultCurrency}
                    />
                </View>

                <GreenButton buttonText={'Update Member Suggestions'} onPress={() => {
                    navigate('UpdateMemberSuggestions');
                }} />
            </View>
        );
    }

    saveDefaultCurrency(currency: Currency) {
        AsyncStorage.setItem('defaultCurrency', JSON.stringify(currency));
        this.setState({ defaultCurrency: currency });
    }

    componentWillMount() {
        AsyncStorage.getItem('defaultCurrency')
            .then((value) => {
                if (value) {
                    this.setState({
                        defaultCurrency: JSON.parse(value)
                    });
                }
            });
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