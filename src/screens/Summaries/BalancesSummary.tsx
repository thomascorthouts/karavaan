import React, {Component, ReactNode} from 'react';
import {View, ScrollView, Text, Button, TouchableOpacity, AsyncStorage, StyleSheet} from 'react-native';
import { currencies } from '../../config/Data';
import {BalanceFeedItem} from '../../components/BalanceFeedItem';

interface IState {
    group: Group;
    currency: Currency;
    balances: Balances;
}
export default class BalancesSummary extends Component<IDefaultNavProps, IState> {

    static navigationOptions = ({ navigation }: {navigation: any}) => {
        const { state, navigate } = navigation;
        if (state.params) {
            const title = state.params.group.name;
            const headerRight = <Button title={'Edit'} onPress={() =>
                navigate('GroupForm', {group: state.params.group, groupArray: state.params.groupArray, update: true})
            }></Button>;
            return {
                headerTitle: `${title}`,
                headerRight: headerRight
            };
        } else {
            return {};
        }
    };

    // This is initially programmed for a group
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            group: this.props.navigation.state.params.group,
            currency: this.props.navigation.state.params.group.defaultCurrency,
            balances: [] as Balances
        };
    }

    render() {

        let balanceItems = this.state.balances.map((val: Balance, key: number) => {
            return <BalanceFeedItem keyval={val.person.id} currency={this.state.currency} person={val.person} balance={val.amount} key={val.person.id}/>;
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollContainer}>
                    {balanceItems}
                </ScrollView>
            </View>
        );
    }

    componentWillMount() {
        let balances: Balances = [];
        AsyncStorage.getItem('expenses-' + this.state.group.id)
            .then((value: string) => {
                let expenses = JSON.parse(value);
                expenses.map((val: Expense) => {
                    val.balances.map((bal: Balance) => {
                        let balFound = balances.find((x: Balance) => x.person.id === bal.person.id);
                        if (typeof balFound !== 'undefined') balFound.amount += bal.amount;
                        else balances.push(bal);
                    });
                });
                this.setState({balances});
            });
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111'
    },
    detailText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        flexWrap: 'wrap'
    },
    detailTextSmall: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#4B9382',
        fontSize: 12,
        flexWrap: 'wrap'
    },
    expense: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    },
    flex: {
        flex: 1
    },
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 40,
        color: '#287E6F',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    }
});