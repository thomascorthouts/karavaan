import React, { ReactNode, Component } from 'react';
import { View, Picker } from 'react-native';

export class CurrencyPicker extends Component<IPropsCurrencyPicker, {}> {
    constructor(props: IPropsCurrencyPicker) {
        super(props);
    }
    render() {
        let currenciesItems: ReactNode[] = new Array();
        let current;
        for (let currency in this.props.currencies) {
            current = this.props.currencies[currency];
            currenciesItems.push(<Picker.Item label={current.name} value={current.tag} key={current.tag} />);
        }
        return (
            <View>
                <Picker onValueChange={this.props.onValueChange} selectedValue={this.props.selectedValue} style={{height: 40}}>
                    {currenciesItems}
                </Picker>
            </View>
        );
    }
}
