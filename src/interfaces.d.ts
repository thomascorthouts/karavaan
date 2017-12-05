interface IDefaultNavProps {
    navigation: any;
}

// Expenses

interface Expense {
    date: string;
    firstname: string;
    lastname: string;
    amount: number;
    currency: string;
}

interface ExpenseList extends Array<Expense> { }

// Groups

interface Group {
    name: string;
    personArray: PersonList;
    expenseArray: ExpenseList;
    date: string;
}

interface GroupList extends Array<Group> { }

// Person

interface Person {
    firstname: string;
    lastname: string;
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