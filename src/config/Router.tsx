import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import { Button } from 'react-native';

import LoginScreen from '../screens/Login';

import ExpenseFeed from '../screens/ExpenseTab/ExpenseFeed';
import AddExpense from '../screens/ExpenseTab/AddExpense';
import ExpenseDetail from '../screens/ExpenseTab/ExpenseDetail';

import GroupFeed from '../screens/GroupTab/GroupFeed';
import AddGroup from '../screens/GroupTab/AddGroup';
import GroupDetail from '../screens/GroupTab/GroupDetail';

import BillSplitter from '../screens/ExpenseTab/AmountSplit';
import Converter from '../screens/Converter';
import Settings from '../screens/Settings';
import GroupExpense from '../screens/ExpenseTab/GroupExpense';

import TransSplit from '../screens/ExpenseTab/TransSplit';
import AmountSplit from '../screens/ExpenseTab/AmountSplit';
import BillSplit from '../screens/ExpenseTab/BillSplit';

export const ExpenseStack = StackNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseFeed
        },
        ExpenseDetail: {
            screen: ExpenseDetail
        },
        AddExpense: {
            screen: AddExpense,
            navigationOptions: {
                tabBarVisible: false
            }
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const GroupStack = StackNavigator(
    {
        GroupFeed: {
            screen: GroupFeed,
            navigationOptions: {
                header: null
            }
        },
        AddGroup: {
            screen: AddGroup,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            }
        },
        GroupDetail: {
            screen: GroupDetail,
            navigationOptions: {
                headerStyle: { 'backgroundColor': '#4B9382' }
            }
        },
        GroupExpenseFeed: {
            screen: ExpenseFeed
        },
        GroupExpenseDetail: {
            screen: ExpenseDetail,
            navigationOptions: {
                header: null
            }
        },
        GroupAddExpense: {
            screen: GroupExpense,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            },
        GroupAddTransaction: {
            screen: TransSplit,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            }
            },
        GroupAddBill: {
            screen: BillSplit,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            },
        GroupAddByAmount: {
            screen: AmountSplit,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            }
        }
        }
        }
    }, {
        mode: 'modal'
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
        },
        Item4: {
            screen: BillSplitter,
            navigationOptions: {
                title: 'BillSplitter'
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
