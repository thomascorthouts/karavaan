import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { OptionPicker } from './OptionPicker';
import * as StringSimilarity from '../../utils/similarity';

interface IProps {
    persons: PersonList;
    choose: any;
    style?: any;
}

interface IState {
    input: string;
    options: ReactNode[];
    scrollHeight: number;
}

interface IPersonSimilarity {
    person: Person;
    similarity: number;
}

interface IPersonSimilarities extends Array<IPersonSimilarity> { }

class PersonPicker extends Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props, state);
        this.state = {
            options: [] as ReactNode[],
            scrollHeight: 0,
            input: ''
        };
    }

    render() {
        return (
            <View>
                <OptionPicker inputLabel={''} placeholder={'Firstname Lastname'} onChangeText={(text: any) => {
                    this.setState({ input: text }, () => this.updateOptions());
                }} textInput={this.state.input} options={this.state.options} scrollHeight={this.state.scrollHeight} />
            </View>
        );
    }

    updateOptions() {
        let options = [] as ReactNode[];
        let name;
        let len = 0;
        let similarities = this.props.persons.map((person: Person) => {
            name = person.firstname + ' ' + person.lastname;

            return { person: person, similarity: StringSimilarity.compareTwoStrings(name, this.state.input) };
        });

        similarities = similarities.sort((a, b) => {
            // Inverted sort on number, because biggest similarity must come first in array
            return (a.similarity < b.similarity) ? 1 : (a.similarity > b.similarity) ? -1 : 0;
        });

        similarities.forEach((val, index) => {
            if (index < 8) {
                options.push(
                    <TouchableOpacity style={styles.item} onPress={() => this.choose(val.person.id)} key={val.person.id + 'payer'}>
                        <Text>{val.person.firstname} {val.person.lastname}</Text>
                    </TouchableOpacity>
                );
            }
        });

        this.setState({ options: options });
    }

    choose(id: string) {
        this.props.choose(id);
    }

    _keyboardDidShow(event: any) {
        this.setState({ scrollHeight: 0.2 });
    }

    _keyboardDidHide(event: any) {
        this.setState({ scrollHeight: 0 });
    }

    componentDidMount() {
        this.updateOptions();
        Keyboard.addListener('keyboardDidShow', (e) => this._keyboardDidShow(e));
        Keyboard.addListener('keyboardDidHide', (e) => this._keyboardDidHide(e));
    }

    componentWillUnmount() {
        Keyboard.removeAllListeners('KeyboardDidShow');
        Keyboard.removeAllListeners('KeyboardDidHide');
    }
}

export default PersonPicker;

const styles = StyleSheet.create({
    item: {
        flex: 1,
        position: 'relative',
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111'
    }
});