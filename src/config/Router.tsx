import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';

import LoginScreen from '../screens/Login';

import ExpenseFeed from '../screens/ExpenseTab/ExpenseFeed';
import AddExpense from '../screens/ExpenseTab/AddExpense';
import ExpenseDetail from '../screens/ExpenseTab/ExpenseDetail';

import GroupFeed from '../screens/GroupTab/GroupFeed';
import AddGroup from '../screens/GroupTab/AddGroup';

import Converter from '../screens/Converter';
import Settings from '../screens/Settings';

export const ExpenseStack = StackNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseFeed
        },
        ExpenseDetail: {
            screen: ExpenseDetail
        },
        AddExpense: {
            screen: AddExpense
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const GroupStack = StackNavigator(
    {
        GroupFeed: {
            screen: GroupFeed
        },
        AddGroup: {
            screen: AddGroup
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const Expenses = TabNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseStack,
            navigationOptions: {
                tabBarLabel: 'Expenses'
            }
        },
        GroupFeed: {
            screen: GroupStack,
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

export const Drawer = DrawerNavigator(
    {
        Item1: {
            screen: Expenses,
            navigationOptions: {
                title: 'Expenses'
            }
        },
        Item2: {
            screen: Converter,
            navigationOptions: {
                title: 'Currency converter'
            }
        },
        Item3: {
            screen: Settings,
            navigationOptions: {
                title: 'Settings'
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
            screen: Drawer
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export default Root;
