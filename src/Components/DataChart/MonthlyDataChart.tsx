import React from "react";
import "./MonthlyDataChart.css";
import { Expense } from "../Expenses/ExpenseInterface";

import { Categories } from "../Expenses/Categories";

interface monthylyDataChartProps {
    expenses: Expense[];    
    currencySymbol: string;
};
const MonthlyDataChart: React.FC<monthylyDataChartProps> = ( {expenses, currencySymbol} ) => {

    return(
        <div className="monthly-data-chart">
            
        </div>
    );
};

export default MonthlyDataChart;