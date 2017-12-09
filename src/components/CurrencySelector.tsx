import React, {ReactNode, Component} from 'react';
import {View, Picker} from 'react-native';

export class CurrencyPicker extends Component<ICurrencyPicker, {}> {
    constructor(props: ICurrencyPicker) {
        super(props);
    }
    render() {
        let currenciesItems: ReactNode[] = new Array();
        let current;
        for (let currency in this.props.currencies) {
            current = this.props.currencies[currency];
            currenciesItems.push(<Picker.Item label={current.name} value={current.tag} key={current.tag}/>);
        }
        return (
            <View>
                <Picker onValueChange={this.props.onValueChange}>
                    {currenciesItems}
                </Picker>
            </View>
    );
    }}