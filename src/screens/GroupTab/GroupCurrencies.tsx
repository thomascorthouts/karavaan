import React, { Component, ReactNode } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import { GreenButton } from '../../components/Buttons/GreenButton';

interface IState {
    currencies: Currencies;
    selected: Currencies;
    default: Currency;
}

class GroupCurrencies extends Component<IDefaultNavProps, IState> {

    static navigationOptions = () => {
        return {
            headerTitle: 'Select Currencies'
        };
    };

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        let navParams = this.props.navigation.state.params;
        this.state = {
            currencies: navParams.currencies,
            selected: navParams.selected,
            default: navParams.default
        };
    }

    render() {
        const { goBack } = this.props.navigation;

        let currencies: ReactNode[] = [];
        for (let key in this.state.currencies) {
            let currency = this.state.currencies[key];
            if (currency.tag !== this.state.default.tag) {
                if (this.state.selected.hasOwnProperty(key)) {
                    currencies.push(<Text key={key} style={styles.selectedItem} onPress={() => this.toggleSelected(key)}>{currency.tag} - {currency.name}</Text>);
                } else {
                    currencies.push(<Text key={key} style={styles.item} onPress={() => this.toggleSelected(key)}>{currency.tag} - {currency.name}</Text>);
                }
            } else {
                currencies.push(<Text key={key} style={styles.selectedItem}>{currency.tag} - {currency.name}</Text>);
            }
        }

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                
                <ScrollView style={styles.ScrollContainer}>
                    {currencies}
                </ScrollView>

                <GreenButton
                    buttonStyle={{ marginBottom: 0 }}
                    buttonText={'SAVE'}
                    onPress={() => {
                        this.props.navigation.state.params.setGroupCurrencies(this.state.selected);
                        goBack();
                    }}
                />
            </View>
        );
    }

    toggleSelected(key: string) {
        let selected = Object.assign({}, this.state.selected);
        if (this.state.selected.hasOwnProperty(key)) {
            delete selected[key];
            this.setState({ selected });
        } else {
            selected[key] = this.state.currencies[key];
            this.setState({ selected });
        }
    }

    componentDidMount() {
        let selected = Object.assign({}, this.state.selected);
        selected[this.state.default.tag] = this.state.currencies[this.state.default.tag];
        this.setState({ selected });
    }
}

export default GroupCurrencies;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1
    },
    item: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111'
    },
    selectedItem: {
        flex: 1,
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: '#111',
        backgroundColor: '#4B9382'
    }
});