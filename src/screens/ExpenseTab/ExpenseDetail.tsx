import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';

class ExpenseDetail extends Component<IDefaultNavProps, {}> {
  constructor(props: IDefaultNavProps) {
    super(props);
  }

  render() {
    const { name } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <Text> {name.first} {name.last} </Text>
      </ScrollView>
    );
  }
}

export default ExpenseDetail;
