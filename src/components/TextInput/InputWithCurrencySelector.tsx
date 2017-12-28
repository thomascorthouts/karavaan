import React from 'react';
import { View } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { CurrencyPicker } from '../CurrencySelector';

export class InputWithCurrencySelector extends React.Component<IPropsWithCurrencyPicker, {}> {
    constructor(props: IPropsWithCurrencyPicker) {
        super(props);
    }

    render() {

        return (
            <View>
                <CurrencyPicker currentCurrency={this.props.currentCurrency} currencies={this.props.currencies} onValueChange={this.props.onValueChange} selectedValue={this.props.selectedValue}/>
                <InputWithoutLabel
                    {...this.props}
                    value = {this.props.value}
                    keyboardType={'numeric'}
                />
            </View>
        );
    }
}