import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
                <OptionPicker
                    inputLabel={''}
                    placeholder={'Firstname Lastname'}
                    onChangeText={(text: any) => {
                        this.setState({ input: text }, () => this.updateOptions());
                    }}
                    textInput={this.state.input}
                    options={this.state.options}
                    scrollHeight={this.state.scrollHeight}
                    onFocus={() => this.setState({ scrollHeight: 0.08 })}
                    onBlur={() => this.setState({ scrollHeight: 0 })}
                />
            </View>
        );
    }

    updateOptions() {
        let options = [] as ReactNode[];
        let name;
        let similarities = this.props.persons.map((person: Person) => {
            name = person.firstname + ' ' + person.lastname;

            return {person: person, similarity: StringSimilarity.compareTwoStrings(name, this.state.input)};
            }) as IPersonSimilarities;

        similarities = similarities.sort((a: IPersonSimilarity, b: IPersonSimilarity) => {

            // Inverted sort on number, because biggest similarity must come first in array
            return (a.similarity < b.similarity) ? 1 : (a.similarity > b.similarity) ? -1 : 0;
        });

        similarities.forEach((val, index) => {
            if (index < 2) {
                let style = (index === 1 ? styles.itemLast : styles.item);
                options.push(
                    <TouchableOpacity style={style}
                                      onPress={() => this.choose(val.person.id)} key={val.person.id + 'payer'}>
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

    componentDidMount() {
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
    itemLast: {
        flex: 1,
        position: 'relative',
        paddingRight: 100
    }
});