import React, { ReactNode, Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { textInputStyles } from './styles';
import * as StringSimilarity from '../../utils/similarity';

interface IState {
    input: string;
    suggestions: ReactNode[];
}

export class InputWithoutLabel extends Component<ITextInputProps, IState> {

    constructor(props: ITextInputProps, state: IState) {
        super(props, state);

        this.state = {
            input: this.props.value || '',
            suggestions: [] as ReactNode[]
        };
    }

    render() {
        const combinedStyle = StyleSheet.flatten(
            [this.props.editable === false ? textInputStyles.disabled : textInputStyles.input, this.props.inputStyle]
        );

        return (
            <View>
                <TextInput
                    {...this.props}
                    style={combinedStyle}
                    underlineColorAndroid={'transparent'}
                    ref={this.props.inputref}
                    value={this.props.value || this.state.input}
                    onChangeText={(text: any) => {
                        if (this.props.onChangeText) {
                            this.props.onChangeText(text);
                        }
                        this.setState({ input: text }, () => {
                            if (this.props.options) {
                                this.updateSuggestions();
                            }
                        });
                    }}
                    onBlur={() => {
                        if (this.props.onBlur) {
                            this.props.onBlur();
                        }
                        if (this.props.clearOnBlur) {
                            this.setState({ input: '' });
                        }
                        if (this.props.options) {
                            this.setState({ suggestions: [] });
                        }
                    }}
                />
                {this.state.suggestions}
            </View>
        );
    }

    updateSuggestions() {
        let match = false;
        let suggestions = [] as ReactNode[];
        if (this.props.options && this.state.input.trim() !== '') {
            this.props.options.map((option: string) => {
                if (!match && (option !== this.state.input || suggestions.length > 3)) {
                    if (option.toLocaleLowerCase().includes(this.state.input.toLocaleLowerCase()) || StringSimilarity.compareTwoStrings(option, this.state.input) > 0.3) {
                        suggestions.push(
                            <TouchableOpacity style={textInputStyles.suggestionButton} onPress={() => this.selectSuggestion(option)} key={option}>
                                <Text style={textInputStyles.suggestionText}>{option}</Text>
                            </TouchableOpacity>
                        );
                    }
                } else if (option === this.state.input.trim()) {
                    match = true;
                }
            });
        } else if (this.state.input.trim() === '') {
            suggestions = [];
        }

        if (match) {
            suggestions = [];
        }

        this.setState({ suggestions });
    }

    selectSuggestion(option: string) {
        this.setState({ input: option, suggestions: [] });

        if (this.props.selectOption) {
            this.props.selectOption(option);
        }
    }

    componentDidMount() {
        if ('inputref' in this.props) {
            this.props.inputref(this);
        }
    }

    componentWillMount() {
        this.updateSuggestions();
    }

    componentWillUnmount() {
        if ('inputref' in this.props) {
            this.props.inputref(undefined);
        }
    }
}