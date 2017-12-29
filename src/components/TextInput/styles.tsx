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
    label: {

    }
});

export { textInputStyles }