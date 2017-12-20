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
    currency: string;
}

interface ExpenseList extends Array<Expense> { }

// Groups

interface Group {
    id: string; //Random hash
    name: string;
    personArray: PersonList; //PersonList will be persons_random hash of group
    expenseArrayId: string; // ExpenseArray will be expenses_random hash of group
    defaultCurrency: Currency;
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
    rate: number;
}

interface Currencies {
    [key: string]: Currency;
}

// Bill Splitting

interface Dish {
    name?: string;
    amount: number;
    users: PersonList;
}

// Balance

interface Balance {
    person: Person;
    amount: number;
    currency: Currency;
}

interface Balances extends Array<Balance> { }