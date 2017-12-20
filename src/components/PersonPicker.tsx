import { Component, ReactNode} from 'react';
import { View, Text, Picker, ScrollView } from 'react-native';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';
import { InputWithButton } from '../components/TextInput/InputWithButton';

interface IState {
    options: PersonList;
    chosenPersons: PersonList;
    currentOptions: Array<any>;
    currentPerson: string;
}
class PersonPicker extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props,state);
        this.state = {
            options: this.props.navigation.state.params.personArray,
            currentOptions: [],
            chosenPersons: [],
            currentPerson: ''
        };
    }

    // TODO This should be a inputfield that searches in persons and adds all persons you want to a list

    render() {
        this.updateOptions();
        return (
            <View>
                <InputWithoutLabel value={this.state.currentPerson} onChangeText={(text: string) => this.setState({ currentPerson: text})} />
                <ScrollView>
                    {this.state.currentOptions}
                </ScrollView>
            </View>
        );
    }

    updateOptions() {
        this.setState({currentOptions: []});
        let name;
        let opts: ReactNode[] = new Array();
        this.state.options.map((val: Person, key: number) => {
            name = val.firstname + ' ' + val.lastname;
            if (name.includes(this.state.currentPerson)) {
                opts.push(<Picker.Item label= {name} value={val.id} key={val.id} />);
            }
        });
        this.setState({currentOptions: opts});
    }
}