import { Dayjs } from 'dayjs';
export interface Expense {
    id: string; //generated by uuid when adding expense
    date: string; // Always store as ISO string
    category: string;
    description: string;
    amount: number;
}