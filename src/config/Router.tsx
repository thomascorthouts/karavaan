import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';

import LoginScreen from '../screens/Login';
import Converter from '../screens/Converter';

import ExpenseFeed from '../screens/ExpenseTab/ExpenseFeed';
import ExpenseForm from '../screens/ExpenseTab/ExpenseForm';
import ExpenseDetail from '../screens/ExpenseTab/ExpenseDetail';

import GroupFeed from '../screens/GroupTab/GroupFeed';
import GroupForm from '../screens/GroupTab/GroupForm';
import GroupExpenseForm from '../screens/GroupTab/GroupExpenseForm';
import GroupCurrencies from '../screens/GroupTab/GroupCurrencies';

import TransSplit from '../screens/SplitOptions/TransSplit';
import AmountSplit from '../screens/SplitOptions/AmountSplit';
import BillSplit from '../screens/SplitOptions/BillSplit';

import BalancesSummary from '../screens/Summaries/BalancesSummary';
import TransactionsSummary from '../screens/Summaries/Transactions';
import ExpensesPerPerson from '../screens/Summaries/ExpensesPerPerson';

import Settings from '../screens/Settings/Settings';
import UpdateMemberSuggestions from '../screens/Settings/UpdateMemberSuggestions';

import AddDish from '../components/AddDish';
import ImageSelector from '../screens/ImageSelector';

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

export const ExpenseStack = StackNavigator(
    {
        ExpenseFeed: {
            screen: ExpenseFeed,
            navigationOptions: {
                header: null
            }
        },
        ExpenseDetail: {
            screen: ExpenseDetail,
            navigationOptions: {
                header: null,
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        AddExpense: {
            screen: ExpenseForm,
            navigationOptions: {
                header: null,
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        ImageSelector: {
            screen: ImageSelector,
            navigationOptions: {
                header: null,
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        ExpenseSummaries: {
            screen: GroupSummaries,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false
            }
        }
    }, {
        mode: 'modal'
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
                tabBarVisible: false
            }
        },
        ImageSelector: {
            screen: ImageSelector,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        GroupCurrencies: {
            screen: GroupCurrencies,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        GroupExpenseFeed: {
            screen: ExpenseFeed,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        GroupSummaries: {
            screen: GroupSummaries,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false
            }
        },
        GroupExpenseDetail: {
            screen: ExpenseDetail,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false,
                header: null
            }
        },
        GroupAddExpense: {
            screen: GroupExpenseForm,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false,
                header: null
            }
        },
        GroupAddTransaction: {
            screen: TransSplit,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false,
                header: null
            }
        },
        GroupAddBill: {
            screen: BillSplit,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false,
                header: null
            }
        },
        AddItem: {
            screen: AddDish,
            navigationOptions: {
                swipeEnabled: false,
                tabBarVisible: false,
                header: null
            }
        },
        GroupAddByAmount: {
            screen: AmountSplit,
            navigationOptions: {
                swipeEnabled: false,
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
        swipeEnabled: true,
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