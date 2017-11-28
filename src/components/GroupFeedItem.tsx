import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export class GroupItem extends React.Component<IGroupProps, {}> {
    constructor(props: IGroupProps) {
        super(props);
    }

    render() {
        return (
            <View key={this.props.keyval} >
                <TouchableOpacity style={styles.item} onPress={this.props.viewDetails}>
                    <View>
                        <Text style={styles.detailText}>{this.props.val.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111'
    },
    detailText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382'
    },
    detailTextSmall: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        fontSize: 12
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