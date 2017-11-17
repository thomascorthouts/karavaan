import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface IThingWithChildren
{
  children: JSX.Element[]
}

const Container = (childbearer: IThingWithChildren) => (
  <View style={styles.container}>
    {childbearer.children}
  </View>
);

export default Container;