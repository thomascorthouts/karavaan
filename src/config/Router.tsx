import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import { Button } from 'react-native';

import LoginScreen from '../screens/Login';

import ExpenseFeed from '../screens/ExpenseTab/ExpenseFeed';
import AddExpense from '../screens/ExpenseTab/AddExpense';
import ExpenseDetail from '../screens/ExpenseTab/ExpenseDetail';

import GroupFeed from '../screens/GroupTab/GroupFeed';
import GroupForm from '../screens/GroupTab/GroupForm';
import GroupExpense from '../screens/GroupTab/AddGroupExpense';
import GroupCurrencies from '../screens/GroupTab/GroupCurrencies';

import TransSplit from '../screens/SplitOptions/TransSplit';
import AmountSplit from '../screens/SplitOptions/AmountSplit';
import BillSplit from '../screens/SplitOptions/BillSplit';

import TableByExpense from '../screens/Summaries/TableByExpense';

import Settings from '../screens/Settings/Settings';
import UpdateMemberSuggestions from '../screens/Settings/UpdateMemberSuggestions';

import Converter from '../screens/Converter';
import AddDish from '../components/AddDish';
import ExpensesPerCategory from '../screens/Summaries/ExpensesPerCategory';
import BalancesSummary from '../screens/Summaries/BalancesSummary';
import TransactionsSummary from '../screens/Summaries/Transactions';
import ExpensesPerPerson from '../screens/Summaries/ExpensesPerPerson';

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
                tabBarVisible: false,
                swipeEnabled: false,
                animationEnabled: false
            }
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const GroupSummaries = TabNavigator(
    {
        CategorySummary: {
            screen: ExpensesPerCategory,
            navigationOptions: {
                tabBarLabel: 'By category'
            }
        },
        BalanceSummary: {
            screen: BalancesSummary,
            navigationOptions: {
                tabBarLabel: 'Balances'
            }
        },
        TransactionSummary: {
            screen: TransactionsSummary,
            navigationOptions: {
                tabBarLabel: 'Transactions'
            }
        },
        PerPersonSummary: {
            screen: ExpensesPerPerson,
            navigationOptions: {
                tabBarLabel: 'By Person'
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

export const GroupStack = StackNavigator(
    {
        GroupFeed: {
            screen: GroupFeed,
            navigationOptions: {
                header: null
            }
        },
        GroupForm: {
            screen: GroupForm,
            navigationOptions: {
                swipeEnabled: false,
                animationEnabled: false
            }
        },
        GroupCurrencies: {
            screen: GroupCurrencies,
            navigationOptions: {
                tabBarVisible: false,
                swipeEnabled: false,
                animationEnabled: false
            }
        },
        GroupExpenseFeed: {
            screen: GroupSummaries,
            navigationOptions: {
                tabBarVisible: false
            }
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
                swipeEnabled: false,
                header: null
            }
        },
        GroupAddTransaction: {
            screen: TransSplit,
            navigationOptions: {
                tabBarVisible: false,
                swipeEnabled: false,
                header: null
            }
        },
        GroupAddBill: {
            screen: BillSplit,
            navigationOptions: {
                tabBarVisible: false,
                swipeEnabled: false,
                header: null
            }
        },
        AddItem: {
            screen: AddDish,
            navigationOptions: {
                tabBarVisible: false,
                swipeEnabled: false,
                header: null
            }
        },
        GroupAddByAmount: {
            screen: AmountSplit,
            navigationOptions: {
                tabBarVisible: false,
                swipeEnabled: false,
                header: null
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

export const SettingsStack = StackNavigator(
    {
        Settings: {
            screen: Settings,
            navigationOptions: {
                header: null
            }
        },
        UpdateMemberSuggestions: {
            screen: UpdateMemberSuggestions
        }
    }, {
        mode: 'modal'
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
            screen: TableByExpense,
            navigationOptions: {
                title: 'Summaries'
            }
        },
        Item4: {
            screen: SettingsStack,
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
