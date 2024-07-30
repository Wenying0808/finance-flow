import React from "react";
import "./MonthlyDataChart.css";
import { Expense } from "../Expenses/ExpenseInterface";
import { Categories } from "../Expenses/Categories";

interface monthylyDataChartProps {
    expenses: Expense[];    
    currencySymbol: string;
};
const MonthlyDataChart: React.FC<monthylyDataChartProps> = ( {expenses, currencySymbol} ) => {

    // transform expenses data to chart data :[{category: 'Education', amount: 100}, {category: 'Education', amount: 100}]
    const chartData = expenses;
    console.log(chartData);
    
    // get each category value from the categories object
    const categoryValues = Categories.map(category => category.value);

    // find the total amount for each category
    const sumOfEachCategory = categoryValues.reduce((dataObject, category) => {
        dataObject[category] = expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
        return dataObject;
    }, {} as Record<string, number>);

    console.log(sumOfEachCategory);
    console.log(typeof sumOfEachCategory);

    return(
        <div className="monthly-data-chart">
            
        </div>
    );
};

export default MonthlyDataChart;