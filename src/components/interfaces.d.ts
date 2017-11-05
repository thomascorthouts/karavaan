interface ILoginProps {
    navigation: any;
}

interface IHomeProps {
    navigation: any;
}

interface IHomeState {
    [index: number]: Expense;
    expenseArray: ExpenseList;
    expenseText: string;
}

interface Expense {
    date: string;
    expense: string;
}

interface ExpenseList extends Array<Expense> { }

interface IExpenseProps {
    keyval: any;
    val: Expense;
    deleteMethod(): void;
}