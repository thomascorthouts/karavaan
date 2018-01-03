import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';

import LoginScreen from '../screens/Login';

import ExpenseFeed from '../screens/ExpenseTab/ExpensesPerCategory';
import AddExpense from '../screens/ExpenseTab/AddExpense';
import ExpenseDetail from '../screens/ExpenseTab/ExpenseDetail';
import ImageSelector from '../screens/ImageSelector';

import GroupFeed from '../screens/GroupTab/GroupFeed';
import GroupForm from '../screens/GroupTab/GroupForm';
import GroupExpense from '../screens/GroupTab/AddGroupExpense';
import GroupCurrencies from '../screens/GroupTab/GroupCurrencies';

import TransSplit from '../screens/SplitOptions/TransSplit';
import AmountSplit from '../screens/SplitOptions/AmountSplit';
import BillSplit from '../screens/SplitOptions/BillSplit';

import Settings from '../screens/Settings/Settings';
import UpdateMemberSuggestions from '../screens/Settings/UpdateMemberSuggestions';

import Converter from '../screens/Converter';
import AddDish from '../components/AddDish';

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
                tabBarVisible: false
            }
        },
        ImageSelector: {
            screen: ImageSelector,
            navigationOptions: {
                tabBarVisible: false
            }
        }
    }, {
        mode: 'modal',
        headerMode: 'none'
    }
);

export const GroupSummaries = TabNavigator(
    {
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
            labelStyle: {
                fontSize: 12
            },
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
            screen: GroupForm
        },
        ImageSelector: {
            screen: ImageSelector,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        GroupCurrencies: {
            screen: GroupCurrencies,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        GroupExpenseFeed: {
            screen: ExpenseFeed,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        GroupSummaries: {
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
                header: null
            }
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
            }
        },
        AddItem: {
            screen: AddDish,
            navigationOptions: {
                tabBarVisible: false,
                header: null
            }
        },
        GroupAddByAmount: {
            screen: AmountSplit,
            navigationOptions: {
                tabBarVisible: false,
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
        swipeEnabled: false,
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
        Expenses: {
            screen: Expenses,
            navigationOptions: {
                title: 'Expenses'
            }
        },
        Converter: {
            screen: Converter,
            navigationOptions: {
                title: 'Currency converter'
            }
        },
        Settings: {
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
