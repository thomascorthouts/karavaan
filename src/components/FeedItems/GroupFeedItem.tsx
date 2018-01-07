import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface IProps {
    keyval: any;
    val: Group;
    viewDetails(): void;
}

export class GroupItem extends React.Component<IProps, {}> {

    constructor(props: IProps) {
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
    }
});