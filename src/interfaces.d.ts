interface IDefaultNavProps {
    navigation: any;
}

// Expenses

interface Expense {
    category: string;
    date: string;
    description: string;
    donor: string;
    receiver: string;
    amount: number;
    currency: string;
}

interface ExpenseList extends Array<Expense> { }

// Groups

interface Group {
    name: string;
    personArray: PersonList;
    expenseArrayId: string;
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

// Bill Splitting

interface Dish{
    name?: string;
    amount: number;
    users: PersonList;
}