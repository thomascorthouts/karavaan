interface IDefaultNavProps {
    navigation: any;
}

interface IHomeProps {
    navigation: any;
}

interface IHomeState {
    [index: number]: Expense;
    expenseArray: ExpenseList;
    isLoading: boolean;
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