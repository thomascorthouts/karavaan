import { NavigationActions } from 'react-navigation';

export const reset = (route) => NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: route })
  ]
});