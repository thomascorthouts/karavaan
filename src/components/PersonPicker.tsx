import { Component, ReactNode} from 'react';
import { View, Text, Picker, ScrollView, Button } from 'react-native';
import { InputWithoutLabel } from '../components/TextInput/InputWithoutLabel';

interface IPersonPickerProps {
    currentPerson: string;
    options: PersonList;
    chosenPersons: PersonList;
}
class PersonPicker extends Component<IPersonPickerProps, {}}> {

    constructor(props: IPersonPickerProps) {
        super(props);
    }


    render() {
        this.updateOptions();
        return (
            <View>
                <InputWithoutLabel value={this.props.currentPerson} onChangeText={(text: string) => this.props.currentPerson = text} />
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
        this.props.options.map((val: Person, key: number) => {
            name = val.firstname + ' ' + val.lastname;
            if (name.includes(this.props.currentPerson)) {
                opts.push(<View><Text>{val.firstname} {val.lastname} </Text>
                    <Button title={'+'} onPress={() => this.addPerson(val.id)} /></View>);
            }
        });
        this.setState({currentOptions: opts});
    }


    addPerson (id: string) {
        let persons = this.props.chosenPersons;
        persons.push(this.props.options.find(this.isPerson));//Remove text from inputfield
    }

    isPerson(person: Person) {
        return person.id === this.state.currentID
    }
}