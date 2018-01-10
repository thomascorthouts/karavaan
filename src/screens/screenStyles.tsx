import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

const colorStyles = EStyleSheet.create({
    white: {
        color: '$white'
    },
    lightGrey: {
        color: '$lightGray'
    },
    grey: {
        color: '$gray'
    },
    darkGrey: {
        color: '$darkGray'
    },
    black: {
        color: '$black'
    },
    lightGreen: {
        color: '$lightGreen'
    },
    darkGreen: {
        color: '$darkGreen'
    },
    red: {
        color: '$red'
    }
});

EStyleSheet.build({
    $white: '#FFFFFF',
    $lightGray: '#D3D3D3',
    $gray: '#AAA',
    $darkGray: '#555',
    $black: '#111',
    $lightGreen: '#4B9382',
    $darkGreen: '#287E6F',
    $red: '#FF0000'
});

const backgroundColorStyles = EStyleSheet.create({
    white: {
        backgroundColor: '$white'
    },
    lightGrey: {
        backgroundColor: '$lightGray'
    },
    grey: {
        backgroundColor: '$gray'
    },
    darkGrey: {
        backgroundColor: '$darkGray'
    },
    black: {
        backgroundColor: '$black'
    },
    lightGreen: {
        backgroundColor: '$lightGreen'
    },
    darkGreen: {
        backgroundColor: '$darkGreen'
    },
    red: {
        backgroundColor: '$red'
    }
});

const standardStyles = EStyleSheet.create({
    relativePosition: {
        position: 'relative'
    },
    absolutePosition: {
        position: 'absolute'
    },
    tripleFlex: {
        flex: 3
    },
    doubleFlex: {
        flex: 2
    },
    flex: {
        flex: 1
    },
    noFlex: {
        flex: 0
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    textCenter: {
        textAlign: 'center'
    },
    boldText: {
        fontWeight: 'bold'
    },
    flexCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const specificStyles = EStyleSheet.create({
    title: {
        fontSize: 40,
        color: '$darkGreen',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    deleteButton: {
        height: 40,
        paddingVertical: 10
    },
    expense: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '$lightGreen'
    },
    leftButton: {
        marginRight: 5
    },
    rightButton: {
        marginLeft: 5
    },
    logo: {
        width: 200,
        height: 200
    },
    feedContainer: {
        flexDirection: 'row',
        paddingTop: 3,
        borderTopWidth: 0.5,
        borderTopColor: '$black'
    },
    buttonContainer: {
        paddingTop: 3,
        borderTopWidth: 0.5,
        borderTopColor: '$black'
    },
    currency: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '$black'
    },
    selectedCurrency: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '$black',
        backgroundColor: '$lightGreen'
    }
});

export { colorStyles, backgroundColorStyles, standardStyles, specificStyles }