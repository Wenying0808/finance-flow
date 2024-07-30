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
    /*console.log(sumOfEachCategory);*/
    /*console.log(Object.entries(sumOfEachCategory));*/
    const chartData = Object.entries(sumOfEachCategory).map(([key, value]) => (
        {
            label: key, 
            data: value
        }
    ));
    console.log(chartData);

    return(
        <div className="monthly-data-chart">
            {/*
            <ChartContainer
                width={500}
                height={400}
            >
                <BarPlot 
                    
                />
            </ChartContainer>
            */
            }
        </div>
    );
};

export default MonthlyDataChart;