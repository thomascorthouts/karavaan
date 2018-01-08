import React, { Component, ReactNode } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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
}

interface IPersonSimilarity {
    person: Person;
    similarity: number;
}

interface IPersonSimilarities extends Array<IPersonSimilarity> {}

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
                <OptionPicker inputLabel={''} placeholder={'Firstname Lastname'} onChangeText={(text: any) => {
                    this.setState({ input: text }, () => this.updateOptions());
                }} textInput={this.state.input} options={this.state.options} />
            </View>
        );
    }

    updateOptions() {
        let options = [] as ReactNode[];
        let name;
        let len = 0;
        let similarities = this.props.persons.map((person: Person) => {
            name = person.firstname + ' ' + person.lastname;

            return {person: person, similarity: StringSimilarity.compareTwoStrings(name, this.state.input)};
            }) as IPersonSimilarities;

        similarities = similarities.sort((a: IPersonSimilarity, b: IPersonSimilarity) => {
            // Inverted sort on number, because biggest similarity must come first in array
            return (a.similarity < b.similarity) ? 1 : (a.similarity > b.similarity) ? -1 : 0;
        });

        similarities.forEach((val: IPersonSimilarity, index: number) => {
            if (index < 2) {
                options.push(<TouchableOpacity style={styles.item}
                                               onPress={() => this.choose(val.person.id)}
                                               key={val.person.id + 'payer'}>
                                                <Text>{val.person.firstname} {val.person.lastname}</Text>
                            </TouchableOpacity>);
            }
        });
        this.setState({ options: options });
    }

    choose(id: string) {
        this.props.choose(id);
    }

    componentWillMount() {
        this.updateOptions();
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
    },
    detailText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        flexWrap: 'wrap'
    },
    detailTextSmall: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        fontSize: 12,
        flexWrap: 'wrap'
    },
    expense: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    }
});