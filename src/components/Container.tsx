import React from 'react';
import { View } from 'react-native';

interface IProps
{
  children: JSX.Element[];
  padding?: number;
  flex?: number;
}

const Container = (props: IProps) => {
  const customstyle = {
    padding: props.padding,
    flex: props.flex
  };

  return (
    <View style={[customstyle]}>
      {props.children}
    </View>
  );
};

export { Container }