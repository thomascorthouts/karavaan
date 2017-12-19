import {Component} from 'react';
import { View } from 'react-native';

interface IState {
    persons: PersonList;
    currentPerson: string;
}
class PersonPicker extends Component<{}, IState> {

    constructor(state: IState) {
        super(state);
        this.state = {
            persons: [],
            currentPerson: ''
        };
    }

    // TODO This should be a inputfield that searches in persons and adds all persons you want to a list

    render() {
        return (
            <View>

            </View>
        );
    }
}