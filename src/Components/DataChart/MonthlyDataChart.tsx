import React from "react";
import "./MonthlyDataChart.css";
import { Expense } from "../Expenses/ExpenseInterface";
import { Categories } from "../Expenses/Categories";
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

interface monthylyDataChartProps {
    expenses: Expense[];    
    currencySymbol: string;
};
const MonthlyDataChart: React.FC<monthylyDataChartProps> = ( {expenses, currencySymbol} ) => {
    
    // get each category value from the categories object
    const categoryValues = Categories.map(category => category.value);

    // find the total amount for each category and store in an object {Educateion: 0, Entertainment: 20, ...}
    const sumOfEachCategory = categoryValues.reduce((dataObject, category) => {
        dataObject[category] = expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
        return dataObject;
    }, {} as Record<string, number>);

    
    // Transform the sumOfEachCategory object into arrays suitable for BarPlot {data: xx, label:xx}
    /* const chartData = Object.entries(sumOfEachCategory).map(([category, amount]) => {
        const categoryObj = Categories.find(c => c.value === category);
        return {
            category,
            amount,
            color: categoryObj ? categoryObj.color : '#000000'
        }
    });
    */
    /*console.log(sumOfEachCategory);*/
    /*console.log(Object.entries(sumOfEachCategory));*/
    const chartCategory = Object.keys(sumOfEachCategory);
    const chartData = Object.values(sumOfEachCategory);
    console.log(chartData, chartCategory);

    return(
        <div className="monthly-data-chart">
            <ChartContainer
                width={400}
                height={250}
                series={[
                    { data: chartData, label: 'Expenses', type: 'bar' }
                ]}
                xAxis={[{ data: chartCategory, scaleType: 'band' }]}
            >
                <BarPlot />
            </ChartContainer>
            
        </div>
    );
};

export default MonthlyDataChart;