import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage } from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';
import { CurrencyPicker } from '../../components/Pickers/CurrencyPicker';
import { _currencies } from '../../config/Data';
import { NavigationActions } from 'react-navigation';
import { specificStyles, standardStyles, backgroundColorStyles } from '../screenStyles';

interface IState {
    currencies: Currencies;
    defaultCurrency: Currency;
}

class Settings extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            currencies: _currencies,
            defaultCurrency: {
                name: 'Euro', tag: 'EUR', rate: 1, symbol: '€'
            } as Currency
        };
    }

    render() {
        const { navigate, dispatch, goBack } = this.props.navigation;

        return (
            <View style={[specificStyles.container, backgroundColorStyles.lightGreen]}>
                <StatusBar hidden={true} />
                <View style={standardStyles.flex}>
                    <Text style={specificStyles.title}>Settings</Text>
                </View>
                <View style={standardStyles.flex}>
                    <Text>Default Currency:</Text>

                    <CurrencyPicker
                        currencies={this.state.currencies}
                        onValueChange={(currency: Currency) => this.saveDefaultCurrency(currency)}
                        selectedValue={this.state.defaultCurrency}
                    />

                    <Text> </Text>
                    <Text style={standardStyles.textCenter}> - - - </Text>
                    <Text> </Text>

                    <GreenButton buttonText={'Update Member Suggestions'} onPress={() => {
                        navigate('UpdateMemberSuggestions');
                    }} />
                </View>

                <GreenButton buttonText={'Done'} onPress={() =>
                    dispatch(NavigationActions.navigate({ routeName: 'Home' }))
                } />
            </View>
        );
    }

    saveDefaultCurrency(currency: Currency) {
        AsyncStorage.setItem('defaultCurrency', JSON.stringify(currency));
        this.setState({ defaultCurrency: currency });
    }

    componentDidMount() {
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