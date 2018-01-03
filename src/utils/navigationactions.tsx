import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';

const reset = (route: string) => NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: route })
    ]
});

export const resetState = (route: string, dispatch: any) => {
    dispatch(reset(route));
};

export const resetGroupState = (group: Group, expenseArray: ExpenseList, dispatch: any) => {
    AsyncStorage.getItem('groups')
        .then((value) => {
            let groupArray = JSON.parse(value);
            let parameters = { group: group, expenseArray: expenseArray, groupArray: groupArray };

            const resetGroup = (_params: any) => NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'GroupFeed' }),
                    NavigationActions.navigate({ routeName: 'GroupExpenseFeed', params: _params})
                ]
            });

            dispatch(resetGroup(JSON.parse(JSON.stringify(parameters))));
        });
};
