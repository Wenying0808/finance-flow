import React from "react";
import "./MonthlyDataChart.css";
import { Expense } from "../Expenses/ExpenseInterface";
import { Categories } from "../Expenses/Categories";
import { BarChart, PieChart} from "@mui/x-charts";

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
    const chartDataSet = Object.entries(sumOfEachCategory).map(([category, amount], index) => {
        const categoryObj = Categories.find(c => c.value === category);
        return {
            id: Number(`${index}`),
            value: amount,
            label: category,
            color: categoryObj ? categoryObj.color : '#000000'
        }
    });

    /*console.log(chartDataSet);*/
    /*console.log(sumOfEachCategory);*/
    /*console.log(Object.entries(sumOfEachCategory));*/

    const chartCategory = Object.keys(sumOfEachCategory);
    const chartData = Object.values(sumOfEachCategory);
    const categoryColorsArray = Categories.map(category => category.color);
    const categoryColors = Categories.map(category => Categories.find(c => c.value === category.label) ? category.color : '#000000');
    console.log(chartData, chartCategory, categoryColors);

    return(
        <div className="monthly-data-chart">
            <BarChart
                width={400}
                height={300}
                series={[
                        {data: chartData},
                ]}
                xAxis={[
                    { 
                        data: chartCategory,
                        scaleType: 'band',
                        label: 'Categories',
                        colorMap: {
                            type:'ordinal',
                            values: chartCategory,
                            colors: categoryColors
                        }  
                    }
                ]}
                yAxis={[
                    { 
                        label: `Amount (${currencySymbol})`,
                    }
                ]}
            />
            
            <PieChart
                width={450}
                height={300}
                series={[
                    { 
                        data: chartDataSet, 
                        innerRadius: 40,
                        outerRadius: 80,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 40, additionalRadius: -20, color: 'gray' },
                    }
                ]}
                slotProps={{
                    legend: {
                        direction: 'column',
                        position: { vertical: 'top', horizontal: 'right' },
                        padding: 20,
                    },
                  }}
            />

            {/*
            <ChartContainer
                width={400}
                height={300}
                series={[
                    { 
                        data: chartData, 
                        label: 'Expenses', 
                        type: 'bar', 
                    }
                ]}
                xAxis={[
                    { 
                        data: chartCategory, 
                        scaleType: 'band' 
                    }
                ]}

            >
                <BarPlot 
                    series={[
                        {
                            color: categoryColors
                        }
                    ]}
                />
                <ChartsXAxis />
                <ChartsYAxis />
            </ChartContainer>
            <ChartContainer
                width={400}
                height={300}
                series={[
                    { 
                        data: chartDataSet, 
                        type: 'pie'
                    }
                ]}
            >
                <PiePlot />
            </ChartContainer> 
            */} 
        </div>
    );
};

export default MonthlyDataChart;