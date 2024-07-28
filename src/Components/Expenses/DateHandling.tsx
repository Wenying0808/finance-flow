import dayjs, { Dayjs } from 'dayjs';
import { Expense } from './ExpenseInterface';

// Use string (ISO format) for storage in Firestore and local state.
// Use Dayjs objects for manipulation and display.

// Convert ISO string to Dayjs object
export const toDateObject = (dateString: string): Dayjs => {
    return dayjs(dateString);
};

// Convert Dayjs object to ISO string
export const toDateString = (date: Dayjs): string => {
    return date.toISOString();
};

// Sort function for expenses
export const sortExpensesByDate = (a: Expense, b: Expense): number => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
};