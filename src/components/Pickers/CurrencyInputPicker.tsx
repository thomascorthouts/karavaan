import React, { Component, ReactNode } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { OptionPicker } from './OptionPicker';

interface IProps {
    currencyList: Currencies;
    chooseCurrency(tag: string): any;
}

interface IState {
    currentInput: string;
    options: ReactNode[];
}

export class CurrencyInputPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);

        this.state = {
            currentInput: '',
            options: [] as ReactNode[]
        };
    }

    render() {
        return (
            <View>
                <OptionPicker inputLabel={'Possible currencies:'} onChangeText={(input: any) => this.update(input)}
                              textInput={this.state.currentInput} options={this.state.options} />
            </View>
        );
    }

    update(input: string) {
        this.setState({ currentInput: input });
        let currenciesItems = [] as ReactNode[];
        let current = {} as Currency;
        for (let key in this.props.currencyList) {
            current = this.props.currencyList[key];
            if (current.name.includes(this.state.currentInput)) {
                currenciesItems.push(<TouchableOpacity key={current.tag} onPress={this.choose.bind(this, current.tag)}><Text>{current.name}</Text></TouchableOpacity>);
            }
        }
        this.setState({ options: currenciesItems });
    }

    choose(tag: string) {
        console.log(tag);
        this.setState({currentInput: ''});
        this.props.chooseCurrency(tag);
    }

}