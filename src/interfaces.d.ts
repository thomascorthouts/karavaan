interface IDefaultNavProps {
    navigation: any;
}

// Expenses

interface Expense {
    category: string;
    date: string;
    description: string;
    balances: Balances;
    amount: number;
    currency: Currency;
    splitOption?: string;
    image?: any;
}

interface ExpenseList extends Array<Expense> { }

// Groups

interface Group {
    id: string;
    name: string;
    // PersonList will be persons- + groupID in asyncstorage
    // ExpenseArray will be expenses- + groupID in asyncstorage
    defaultCurrency: Currency;
    currencies: Currencies; // Array of the currencies
}

interface GroupList extends Array<Group> { }

// Person

interface Person {
    id: string; // At the moment this is a string of firstname_lastname
    firstname: string;
    lastname: string;
    balance: number; // Always in ..?
}

interface PersonList extends Array<Person> { }

// Currency

interface Currency {
    name: string;
    tag: string;
    symbol: string;
    rate?: number;
    base?: string;
    date?: string;
}

interface Currencies {
    [key: string]: Currency;
}

// Bill Splitting

interface Dish {
    id: string;
    name: string;
    amount: number;
    users: PersonList;
}

// Balance

interface Balance {
    // Currency of specific balance can be found in the expense it is in
    person: Person;
    amount: number;
}

interface Balances extends Array<Balance> { }

// ignore errors for javascript only packages
declare module 'react-native-table-component-pro'
declare module 'react-native-datepicker'
declare module 'expo'
