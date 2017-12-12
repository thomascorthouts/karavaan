interface IDefaultNavProps {
    navigation: any;
}

// Expenses

interface Expense {
    date: string;
    firstname: string;
    lastname: string;
    category: string;
    amount: number;
    currency: string;
   avatarSource:any;
   data:any;
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