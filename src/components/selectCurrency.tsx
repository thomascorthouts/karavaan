import React, {ReactNode, Component} from 'react';
import {View, Picker} from 'react-native';

export class CurrencyPicker extends Component<ICurrencyPicker, {}> {
    constructor(props: ICurrencyPicker) {
        super(props);
    }
    render() {
        let currenciesItems: ReactNode[] = new Array();
        let mapIter = this.props.currencies.values();
        let currency;
        for (let i = 0; i < this.props.currencies.size ; ++i ) {
            currency = mapIter.next();
            currenciesItems.push(<Picker.Item label={currency.value.name} value={currency.value.tag}/>);
        }
        return (
            <View>
                <Picker>
                    {currenciesItems}
                </Picker>
            </View>
    );
    }}
