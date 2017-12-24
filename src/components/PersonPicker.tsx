import {Component, ReactNode} from 'react';
import {View, ScrollView, Text, TouchableOpacity }from 'react-native';
import OptionPicker from './OptionPicker';

interface IProps {
    persons: PersonList;
    input: string;
}

interface IState {
    options: ReactNode[];
    chosen: PersonList;
}

// TODO  At the end, all chosen persons are stored in personlist "chosen", communication to parent element?

class PersonPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);
        this.state = {
            options: [] as ReactNode[],
            chosen: [] as PersonList
        };
    }

    componentWillMount() {
        this.update();
    }

    render() {
        return(
            <View>
                <OptionPicker inputLabel={'Name:'} onChangeText={() => this.update()} textInput={this.props.input} options={this.state.options}/>
                <ScrollView>
                    {this.state.options}
                </ScrollView>
            </View>
        );
    }

    update() {
        if (this.props.input !== '') {
            let options = [] as ReactNode[];
            let name = '';
            this.props.persons.map((person: Person, index: number) => {
                name = person.firstname + ' ' + person.lastname;
                if (name.includes(this.props.input)) {
                    options.push(<TouchableOpacity onPress={() => this.choose(person.id)}><Text>{person.firstname} {person.lastname}</Text></TouchableOpacity>);
                }
            });

            this.setState({options: options});
        }
    }

    choose(id: string) {
        this.props.persons.map((person: Person, index: number) => {
            if (person.id === id) {
                let chosen = this.state.chosen;
                chosen.push(person);
                this.setState({chosen: chosen});
            }
        });
    }
}

export default PersonPicker;