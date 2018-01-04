import React from 'react';
import { StyleSheet } from 'react-native';

const textInputStyles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#000',
        paddingHorizontal: 10
    },
    disabled: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 10,
        color: '#555',
        paddingHorizontal: 10
    },
    suggestionButton: {
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: -10,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderColor: '#AAA',
        borderStyle: 'solid',
        borderTopWidth: 1
    },
    suggestionText: {
        color: '#CCC'
    },
    label: {

    },
    flex: {
        flex: 1
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    inputAmount: {
        flex: 2
    }
});

export { textInputStyles }