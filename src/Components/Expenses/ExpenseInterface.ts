export interface Expense {
    id: string; //generated by uuid when adding expense
    date: string;
    category: string;
    description: string;
    amount: number;
    
}