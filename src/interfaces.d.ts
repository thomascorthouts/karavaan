interface IDefaultNavProps {
   
    navigation: any;
}

interface IHomeProps {
    navigation: any;
}

interface IHomeState {
    [index: number]: Expense;
    expenseArray: ExpenseList;
}

interface Expense {
    date: string;
    name: string;
    expense: string;
}

interface ExpenseList extends Array<Expense> { }

interface IExpenseProps {
    keyval: any;
    val: Expense;
    viewDetails(): void;
}

interface IGroupProps {
    keyval: any;
    val: Group;
    viewDetails(): void;
}

interface IGroupState {
    [index: number]: Group;
    groupArray: GroupList;
    isLoading: boolean;
}

interface IAddGroupState {
    //group: Group;
    name: string;
    date: string;
    personArray: PersonList;
    groupArray: GroupList;
}

interface GroupList extends Array<Group> { }

interface Group {
    name: string;
    personArray: PersonList;
    date: string;
}

interface PersonList extends Array<Person> { }

interface Person {
    firstname: string;
    lastname: string;
}