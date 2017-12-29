import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component-pro';

class TableView extends Component {
    render() {
        const tableHead = ['Head', 'Head2', 'Head3', 'Head4'];
        const tableData = [
            ['1', '2', '3', '4'],
            ['a', 'b', 'c', 'd']
        ];

        return (
            <View>
                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                    <Rows data={tableData} style={styles.row} textStyle={styles.text} />
                </Table>
            </View>
        );
    }
}

export default TableView;

const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { marginLeft: 5 },
    row: { height: 30 }
});