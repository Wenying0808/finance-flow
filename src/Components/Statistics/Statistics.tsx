import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './Statistics.css';
import { Button, Modal } from '@mui/material';
import { Expense } from '../Expenses/ExpenseInterface';
import AddExpensePage from '../Expenses/AddExpense';
import EditExpensePage from '../Expenses/EditExpense';
import dayjs from 'dayjs';
import { MdFastfood  } from "react-icons/md";
import { FaHeart, FaHome, FaShoppingBasket, FaTrain } from "react-icons/fa";
import { BsSuitcaseFill } from "react-icons/bs";
import { IconType } from 'react-icons';


interface StatisticsProps {
  currency: string;
  startDate: number;
  budget: number;
  currencySymbol: string;
  onDeleteExpense: (expenseId: string) => void;
}


interface CategoryIconMap {
  [key: string]: IconType; // Map category strings to corresponding icon components
}

const categoryIconMap: CategoryIconMap = {
  'Food & Drinks': MdFastfood,
  'Health & Care': FaHeart,
  'Holidays': BsSuitcaseFill,
  'Home & Utilities': FaHome,
  'Shopping': FaShoppingBasket,
  'Transportation': FaTrain,
};

const Statistics: React.FC<StatisticsProps> = ({currency, startDate, budget, currencySymbol, onDeleteExpense}) => {

  
  const [selectedMonthAndYear, setSelectedMonthAndYear] = useState({month:dayjs().month(), year: dayjs().year()});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState<number>(0);
  const [monthlyBalance, setMonthlyBalance] = useState<number>(budget);

  

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense)
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingExpense(null);
    setEditModalOpen(false);
  };

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      //edit existing expense
      const updatedExpenses = expenses.map((log) => log.id === editingExpense.id ? {...log, ...expense} : log);
      setExpenses(updatedExpenses);
      handleCloseEditModal();
    } else {
      //add new expense
      setExpenses([expense, ...expenses ]); // add new on the top of the list
      handleCloseModal();
    }
  }

  const getCategoryIcon = (category: string): ReactNode => {
    const Icon = categoryIconMap[category];
    return Icon ? <Icon /> : '';
  };

  // Filter expenses based on selected month & year
  const formattedSelectedMonthAndYear = dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY');

  const filteredExpenses = useMemo(() => {
    if(!expenses.length) return [];
    return expenses.filter((expense) => dayjs(expense.date).format('MM YYYY') === formattedSelectedMonthAndYear);
  },[expenses, formattedSelectedMonthAndYear]);

  const handlePreviousMonth = () => {
    setSelectedMonthAndYear((prevState) => ({
      ...prevState, 
      month: prevState.month === 0 ? 11 : prevState.month - 1,
      year: prevState.month === 0 ? prevState.year - 1 : prevState.year,
    })); // january is 0; December is 11
    
  }; 

  const handleNextMonth = () => {
    setSelectedMonthAndYear((prevState) => ({
      ...prevState, 
      month: prevState.month === 11 ? 0 : prevState.month + 1,
      year: prevState.month === 11 ? prevState.year + 1 : prevState.year,
    }));
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    setExpenses(updatedExpenses);
  };
 
  function sortExpenseByDate(expenses: Expense[]) {
    return expenses.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }


  useEffect(() => {
    //sort log from the latest to the oldest
    const sortedExpenses = sortExpenseByDate(expenses);
    setExpenses(sortedExpenses);

    //filter expenses based on selected month and year

    const filteredExpensesByMonthAndYear = expenses.filter((expense) => 
      dayjs(expense.date).format('MM YYYY') === formattedSelectedMonthAndYear
    );

    //sum the expense whenever expense changes
    const sumOfMonthlyExpense = filteredExpensesByMonthAndYear.reduce((accumulation, newExpense)=> accumulation + newExpense.amount, 0 ); //inital accumultation is 0
  
    setMonthlyTotalExpense(sumOfMonthlyExpense);

    setMonthlyBalance(budget-sumOfMonthlyExpense);

  }, [expenses, budget, formattedSelectedMonthAndYear]);

  
  return (
    <div className="statsitcs-content">
      <div className="month-control">
        <Button onClick={handlePreviousMonth}>Prev</Button>
        <span>{dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY')}</span>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>
      <div className="summary">
        <div className="summary-info">
          <div className="summary-info-header">Budget: </div>
          <div className="summary-info-value budget">{currencySymbol}{budget}</div>
        </div>
        <div className="summary-info">
          <div className="summary-info-header">Monthly Expense: </div>
          <div className="summary-info-value expense">{currencySymbol}{monthlyTotalExpense}</div>
        </div>
        <div className="summary-info">
          <div className="summary-info-header">Monthly Balance: </div>
          <div className="summary-info-value balance">{currencySymbol}{monthlyBalance}</div>
        </div>
  
      </div>
      <div className="summary-log">
        <div className="summary-log-list">
          {filteredExpenses.map((expense, index) => (
              <div className="log-card" key={index} onClick={() => handleOpenEditModal(filteredExpenses[index])}>
                <div className="log-card-date">{dayjs(expense.date).format('DD/MM/YYYY')}</div>
                <div className="log-card-category">{getCategoryIcon(expense.category)}</div>
                <div className="log-card-description">{expense.description}</div>
                <div className="log-card-amount">{currencySymbol}{expense.amount}</div>
                
              </div>
            ))}
        </div>
        <div className="summary-log-button">
          <Button variant="contained" onClick={handleOpenModal}>Add Expense</Button>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-expense-modal"
      >
        <AddExpensePage onSave={handleSaveExpense} onCancel={handleCloseModal} currencySymbol={currencySymbol}/>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-expense-modal"
      >
        <EditExpensePage currencySymbol={currencySymbol} expense={editingExpense} onSave={handleSaveExpense} onCancel={handleCloseEditModal} onDeleteExpense={handleDeleteExpense} />
      </Modal>
    </div>
  );
};

export default Statistics;