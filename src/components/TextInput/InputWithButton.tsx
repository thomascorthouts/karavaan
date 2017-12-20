import Component from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { InputWithoutLabel } from './InputWithoutLabel';
import { textInputStyles } from './styles';

interface IPropsWithButton {
    buttonText: string;
    onPress: any;
}

export class InputWithButton extends Component<IPropsWithButton, {}> {
    constructor(props: IPropsWithButton) {
        super(props);
    }

    render() {

        return (
            <View>
                <InputWithoutLabel
                {...this.props}
                />
                <Button title={this.props.buttonText} onPress={() => this.props.onPress} />
            </View>
        );
    }
}