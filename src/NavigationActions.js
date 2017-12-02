import { NavigationActions } from 'react-navigation';

export const goHome = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home'})
    ]
});