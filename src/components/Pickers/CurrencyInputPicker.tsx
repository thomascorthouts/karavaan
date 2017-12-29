import React, { Component, ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OptionPicker } from './OptionPicker';

interface IProps {
    currencyList: Currencies;
}

interface IState {
    chosenCurrencies: Array<string>;
    currentInput: string;
    options: ReactNode[];
}

export class CurrencyInputPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            chosenCurrencies: [] as Array<string>,
            currentInput: '',
            options: [] as ReactNode[]
        };
    }

    render() {
        this.update();
        return (
            <View>
                <OptionPicker inputLabel={'Possible currencies:'} onChangeText={(input: any) => this.setState({ currentInput: input })} textInput={this.state.currentInput} options={this.state.options} />
            </View>
        );
    }

    update() {
        let currenciesItems = [] as ReactNode[];
        let current = {} as Currency;
        for (let currency in this.props.currencyList) {
            current = this.props.currencyList[currency];
            if (current.name.includes(this.state.currentInput)) {
                currenciesItems.push(<TouchableOpacity onPress={() => this.choose(current.tag)}> {current.name} </TouchableOpacity>);
            }
        }

        this.setState({ options: currenciesItems });
    }

    choose(tag: string) {
        let chosen = this.state.chosenCurrencies;
        chosen.push(tag);
        this.setState({ chosenCurrencies: chosen });
    }

}