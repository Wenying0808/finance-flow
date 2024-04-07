import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './Statistics.css';
import { Button, IconButton, Modal } from '@mui/material';
import { Expense } from '../Expenses/ExpenseInterface';
import AddExpensePage from '../Expenses/AddExpense';
import EditExpensePage from '../Expenses/EditExpense';
import dayjs from 'dayjs';
import { MdFastfood  } from "react-icons/md";
import { FaHeart, FaHome, FaShoppingBasket, FaTrain } from "react-icons/fa";
import { BsSuitcaseFill } from "react-icons/bs";
import { IconBase, IconType } from 'react-icons';
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { useUserContext } from '../../Contexts/UserContextProvider';
import { collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";
import { RiDeleteBinLine, RiEdit2Line  } from "react-icons/ri";


interface StatisticsProps {
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

const Statistics: React.FC<StatisticsProps> = ({ onDeleteExpense }) => {

  //access uid from context
  const {currencySymbol, budget, uid,  userDocId, db, usersRef} = useUserContext();

  const [selectedMonthAndYear, setSelectedMonthAndYear] = useState({month:dayjs().month(), year: dayjs().year()});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState<number>(0);
  const [monthlyBalance, setMonthlyBalance] = useState<number>(budget);

  // Function to fetch expenses from firestore
  useEffect(() => {
    const fetchExpenses = async() => {
      if (uid){
        //fetch expense from firestore when sign in 
        try{
          const userDocRef = doc(db, "Users", uid);
          const expensesCol = collection(userDocRef, "expenses");

          const q = query(expensesCol);
          const querySnapshot = await getDocs(q);
          const fetchedExpenses: Expense[]=[];
          querySnapshot.forEach((doc) => {
            fetchedExpenses.push( {id: doc.id, ...doc.data()} as Expense );
          })
          // Sort fetched expenses by date from latest to oldest
          fetchedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setExpenses(fetchedExpenses);
          console.log("fetched expenses", fetchedExpenses);
        } catch (error: any){
          console.error("Error fetching expenses:", error.message);
        }

      } else {
        //fetch expense from session storage if not signed in
        const savedExpenses = sessionStorage.getItem('expenses');
        if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses));
          console.log("expenses", expenses);
        } catch (error) {
          console.error("Error parsing expenses from sessionStorage:");
          // Handle potential corrupted data or invalid JSON format
        }
      }
      }
    }
    fetchExpenses(); //call the fetch function
  }, [uid]);


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense)
    setEditModalOpen(true);

    console.log("expense:",expense);
  };

  const handleCloseEditModal = () => {
    setEditingExpense(null);
    setEditModalOpen(false);
  };


  const handleSaveExpense = async (expense: Expense) => {
    try{
      const userDocRef = doc(db, "Users", uid);

      if (editingExpense) {
        //edit existing expense
        const updatedExpenses = expenses.map((log) => log.id === editingExpense.id ? {...log, ...expense} : log);
        setExpenses(updatedExpenses);
        handleCloseEditModal();

      } else {
        //add new expense
        //create a new expense document with the generated ID from uuid4()
        const expenseRef = doc(collection(userDocRef, "expenses"), expense.id);

        //Add expense data to expense doc
        await setDoc(expenseRef, expense);

        const updatedExpenses = [...expenses, expense];
        const sortedUpdatedExpenses = updatedExpenses.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
 
        setExpenses(sortedUpdatedExpenses); // add new on the top of the list
        handleCloseModal();
      }

    } catch(error: any) {
      console.error("Error saving expense:", error.message);
    }
  }

  const getCategoryIcon = (category: string): ReactNode => {
    const Icon = categoryIconMap[category];
    return Icon ? <Icon /> : '';
  };

  // Filter expenses based on selected month & year
  const formattedSelectedMonthAndYear = dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY');

  // used 
  const filteredExpenses = useMemo(() => {
    if(!expenses.length) return [];
    return expenses.filter((expense) => dayjs(expense.date).format('MM YYYY') === formattedSelectedMonthAndYear);
  },[expenses, selectedMonthAndYear, formattedSelectedMonthAndYear]);

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
    deleteExpenseFromFirestore(expenseId);
  };

  const deleteExpenseFromFirestore = async(expenseId: string) => {
    if (!uid) return; // don't proceed if not logged in
    try {
      const userDocRef = doc(db, "Users", uid);
      const expensesCol = collection(userDocRef, "expenses");
      const expenseDocRef = doc(expensesCol, expenseId);

      await deleteDoc(expenseDocRef);

    } catch(error: any) {
      console.error("Error deleting expense from Firestore:", error.message);
    }
  };
 
  function sortExpenseByDate(expenses: Expense[]) {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }


  // Function to save expenses to sessionStorage when users is logged out
  const saveExpensesToSessionStorage = (expenses: Expense[]) => {
    sessionStorage.setItem('expenses', JSON.stringify(expenses));
  }

  useEffect(() => {
    // Call function to save expenses whenever expenses change 
    saveExpensesToSessionStorage(expenses);
    
    //filter expenses based on selected month and year
    const filteredExpensesByMonthAndYear = expenses.filter((expense) => 
      dayjs(expense.date).format('MM YYYY') === formattedSelectedMonthAndYear
    );

    //sort log from the latest to the oldest
    const sortedFilteredExpenses = sortExpenseByDate(filteredExpensesByMonthAndYear);

    //sum the expense whenever expense changes
    const sumOfMonthlyExpense = sortedFilteredExpenses.reduce((accumulation, newExpense)=> accumulation + newExpense.amount, 0 ); //inital accumultation is 0
  
    setMonthlyTotalExpense(sumOfMonthlyExpense);

    setMonthlyBalance(budget-sumOfMonthlyExpense);

  }, [expenses, budget, formattedSelectedMonthAndYear]);

  
  return (
    <div className="statsitcs-content">
      <div className="month-control">
        <IconButton sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} aria-label="previous month" onClick={handlePreviousMonth}>
          <GrFormPreviousLink />
        </IconButton>
        <span className="month-control-header">{dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY')}</span>
        <IconButton sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} aria-label="next month" onClick={handleNextMonth}>
          <GrFormNextLink />
        </IconButton>
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
              <div className="log-card" key={index} >
                <div className="log-card-date">{dayjs(expense.date).format('DD/MM/YYYY')}</div>
                <div className="log-card-category">{getCategoryIcon(expense.category)}</div>
                <div className="log-card-description">{expense.description}</div>
                <div className="log-card-amount">{currencySymbol}{expense.amount}</div>
                <IconButton 
                  size="small" 
                  sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} 
                  onClick={()=>handleDeleteExpense(expense.id)}>
                  <RiDeleteBinLine/>
                </IconButton>
                {/*
                <IconButton size="small" onClick={() => handleOpenEditModal(filteredExpenses[index])}><RiEdit2Line/></IconButton>
                */}
              </div>
            ))}
        </div>
        <div className="summary-log-button">
          <Button 
            variant="contained" 
            sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}} 
            onClick={handleOpenModal}
          >
            Add Expense
          </Button>
          {/*<div>uid:{uid}</div>*/}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-expense-modal"
      >
        <AddExpensePage 
          onSave={handleSaveExpense} 
          onCancel={handleCloseModal}  
        />
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-expense-modal"
      >
        <EditExpensePage 
          expense={editingExpense} 
          onSave={handleSaveExpense} 
          onCancel={handleCloseEditModal} 
          onDeleteExpense={handleDeleteExpense} 
        />
      </Modal>
    </div>
  );
};

export default Statistics;