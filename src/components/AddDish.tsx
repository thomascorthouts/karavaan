import { Component } from 'react';
import { View } from 'react-native';
import {InputWithLabel} from './TextInput/InputWithLabel';

interface IState {
    description: string;
    amount: string;
    users: Array<string>;
}

export default class AddDish extends Component<IDefaultNavProps, IState> {

    constructor (props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            description: '',
            amount: '0',
            users: []
        };
    }

    render() {
        return(
            <View>
                    <InputWithLabel labelText={'description'} value={ this.state.description } onChangeText={(description: string) => this.setState({description}) } />
                    <InputWithLabel labelText={'amount'} value={ this.state.amount.toString() } onChangeText={ (amount: string) =>  this.setState({amount}) } />
                    <InputWithLabel labelText={'people'} value={ this.state.description } onChangeText={(description: string) => this.setState({description})} />
            </View>
        );
    }
}