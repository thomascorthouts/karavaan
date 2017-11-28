import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';

import ExpenseFeed from '../screens/Expenses';
import LoginScreen from '../screens/Login';
import UserScreen from '../screens/User';
import ExpenseDetail from '../screens/ExpenseDetail';
import Groups from '../screens/Groups';
import AddGroupForm from '../screens/AddGroupForm';
import Converter from '../screens/Converter';

export const ExpenseStack = StackNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseFeed
        },
        ExpenseDetail: {
            screen: ExpenseDetail
        },
        NewExpense: {
            screen: UserScreen
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const GroupStack = StackNavigator(
    {
        GroupFeed: {
            screen: Groups
        },
        AddGroup: {
            screen: AddGroupForm
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
        Groups: {
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
