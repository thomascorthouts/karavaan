import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import ExpenseFeed from '../screens/Expenses';
import LoginScreen from '../screens/Login';
import ExpenseDetail from '../screens/ExpenseDetail';
import Groups from '../screens/Groups';

export const ExpenseStack = StackNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseFeed
        },
        ExpenseDetail: {
            screen: ExpenseDetail
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const Tabs = TabNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseStack,
            navigationOptions: {
                tabBarLabel: 'Expenses'
            }
        },
        Groups: {
            screen: Groups,
            navigationOptions: {
                tabBarLabel: 'Groups'
            }
        }
    }, {
        tabBarOptions: {
            activeTintColor: '#D3D3D3',
            style: {
                backgroundColor: '#287E6F'
            }
        }
    }
);

const Root = StackNavigator(
    {
        Login: {
            screen: LoginScreen
        },
        Home: {
            screen: Tabs
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export default Root;
