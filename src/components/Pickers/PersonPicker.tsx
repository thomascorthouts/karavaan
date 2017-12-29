import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OptionPicker } from './OptionPicker';

interface IProps {
    persons: PersonList;
    choose: any;
}

interface IState {
    input: string;
    options: ReactNode[];
}

class PersonPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);
        this.state = {
            options: [] as ReactNode[],
            input: ''
        };
    }

    render() {
        return (
            <View>
                <OptionPicker inputLabel={'Name:'} onChangeText={(text: any) => {
                    this.setState({ input: text }, () => this.updateOptions());
                }} textInput={this.state.input} options={this.state.options} />
            </View>
        );
    }

    updateOptions() {
        let options = [] as ReactNode[];
        let name;
        this.props.persons.map((person: Person, index: number) => {
            name = person.firstname + ' ' + person.lastname;
            if (name.toLowerCase().includes(this.state.input.toLocaleLowerCase())) {
                options.push(<TouchableOpacity onPress={() => this.choose(person.id)} key={person.id}><Text>{person.firstname} {person.lastname}</Text></TouchableOpacity>);
            }
        });

        this.setState({ options: options });
    }
    componentWillMount() {
        this.updateOptions();
    }

    choose(id: string) {
        this.props.choose(id);
    }
}

export default PersonPicker;