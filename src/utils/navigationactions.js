import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';

const reset = (route) => NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: route })
    ]
});

export const resetState = (route, dispatch) => {
    dispatch(reset(route));
};

export const resetGroupState = (group, expenseArray, dispatch) => {
    AsyncStorage.getItem('groups')
        .then((value) => {
            let groupArray = JSON.parse(value);
            let params = { group: group, expenseArray: expenseArray, groupArray: groupArray }

            const reset = (group, expenseArray) => NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'GroupFeed' }),
                    NavigationActions.navigate({ routeName: 'GroupExpenseFeed', params: params })
                ]
            });

            dispatch(reset());
        });
}
