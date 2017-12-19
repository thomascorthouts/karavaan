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
    expenseArrayId: string;
    date: string;
}

interface GroupList extends Array<Group> { }

interface PersonList extends Array<Person> { }

interface Person {
    key: any;
    name: string;
}