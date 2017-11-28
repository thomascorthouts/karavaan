import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IProps
{
  children: JSX.Element[];
  style?: any;
}

const RowContainer = (props: IProps) => {
  const combinedStyle = StyleSheet.flatten([styles.container, props.style]);

  return (
    <View style={combinedStyle}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

export { RowContainer }