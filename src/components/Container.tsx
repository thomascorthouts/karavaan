import React from 'react';
import { View } from 'react-native';

interface IProps
{
  children: JSX.Element[];
  style?: any;
}

const Container = (props: IProps) => {
  return (
    <View style={props.style}>
      {props.children}
    </View>
  );
};

export { Container }