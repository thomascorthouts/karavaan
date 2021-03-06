import React, { ReactNode, Component } from 'react';
import { View, Picker } from 'react-native';

interface IProps {
    currencies: Currencies;
    selectedValue: Currency;
    onValueChange: any;
}

export class CurrencyPicker extends Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        let current;
        let currenciesItems: ReactNode[] = [];
        for (let currency in this.props.currencies) {
            current = this.props.currencies[currency];
            currenciesItems.push(<Picker.Item label={current.tag + ' - ' + current.name} value={current} key={current.tag} />);
        }

        return (
            <View>
                <Picker onValueChange={this.props.onValueChange} selectedValue={this.props.currencies[this.props.selectedValue.tag]} style={{ height: 40 }}>
                    {currenciesItems}
                </Picker>
            </View>
        );
    }
}
