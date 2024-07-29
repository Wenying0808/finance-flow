import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './Statistics.css';
import { Button, IconButton, Modal } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { Expense } from '../Expenses/ExpenseInterface';
import AddExpensePage from '../Expenses/AddExpense';
import EditExpensePage from '../Expenses/EditExpense';
import dayjs, { Dayjs } from 'dayjs';
import { toDateObject, toDateString, sortExpensesByDate } from "../Expenses/DateHandling";
import { MdFastfood  } from "react-icons/md";
import { FaHeart, FaHome, FaShoppingBasket, FaTrain } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";
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
  'Education': FaBook,
  'Entertainment & Recreation': IoGameController,
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
  const [isMonthMenuOpen, setMonthMenuOpen] = useState<boolean>(false);
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
          fetchedExpenses.sort(sortExpensesByDate);

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

  const handleMonthMenu = () => {
    setMonthMenuOpen(!isMonthMenuOpen);
  }

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
      const expenseRef = doc(collection(userDocRef, "expenses"), expense.id);

      // update existing expens or add new expense
      await setDoc(expenseRef, expense);

      // update local state
      setExpenses(prevExpenses => {

        const updatedExpenses = [...prevExpenses];
        const index = updatedExpenses.findIndex(e => e.id === expense.id);   
        
        if (index !== -1) {
        // update exsiting expense (index exist)
          updatedExpenses[index] = expense;
        }
        else {
        // add new expense
        updatedExpenses.push(expense);
        }
        return updatedExpenses.sort(sortExpensesByDate);
       
      });
      // Close the modals
      setModalOpen(false);
      setEditModalOpen(false);

      console.log("Expense saved successfully:", expense);

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

  const filteredExpenses = useMemo(() => {
    if(!expenses.length) return [];
    return expenses.filter((expense) => dayjs(expense.date).format('MM YYYY') === formattedSelectedMonthAndYear);
  },[expenses, selectedMonthAndYear, formattedSelectedMonthAndYear]);

  const handlePreviousYear = () => {
    setSelectedMonthAndYear((prevState) => ({
      ...prevState, 
      month: prevState.month,
      year: prevState.year - 1,
    }));
  };
  const handleNextYear = () => {
    setSelectedMonthAndYear((prevState) => ({
      ...prevState, 
      month: prevState.month,
      year: prevState.year + 1,
    }));
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonthAndYear((prevState) => ({
      ...prevState,
      month,
    }));
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    deleteExpenseFromFirestore(expenseId);

    setEditModalOpen(false);
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
    return [...expenses].sort(sortExpensesByDate);
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
    const sumOfMonthlyExpense = sortedFilteredExpenses.reduce(
      (accumulation, newExpense) => accumulation + newExpense.amount, 
      0 
    ); //inital accumultation is 0
  
    // round to 2 decimal places
    const roundedSumOfMonthlyExpenses = Number(sumOfMonthlyExpense.toFixed(2));
    setMonthlyTotalExpense(roundedSumOfMonthlyExpenses);

    const roundedMonthlyBlance = Number((budget - roundedSumOfMonthlyExpenses).toFixed(2))

    setMonthlyBalance(roundedMonthlyBlance);

  }, [expenses, budget, formattedSelectedMonthAndYear]);

  
  return (
    <>
      <div className="month-year-control">
        <span className="month-year-control-header">
          {dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY')}
        </span>
        <IconButton onClick={handleMonthMenu}>
        {isMonthMenuOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </div>
      {isMonthMenuOpen && (
          <div className="month-menu">
            <div className='year-control'>
              <IconButton sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} aria-label="previous month" onClick={handlePreviousYear}>
              <GrFormPreviousLink />
              </IconButton>
              <span className="year-control-header">{dayjs().year(selectedMonthAndYear.year).format('YYYY')}</span>
              <IconButton sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} aria-label="next month" onClick={handleNextYear}>
                <GrFormNextLink />
              </IconButton>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MonthCalendar 
                  value={dayjs()
                  .month(selectedMonthAndYear.month)
                  .year(selectedMonthAndYear.year)}
                  onChange={(newDate) => handleMonthSelect((newDate as Dayjs).month())}
                  sx={{
                    transform: 'scale(0.8)', 
                    width: '240px', 
                    height: 'auto', 
                    '& .MuiPickersCalendarHeader-root': {
                      fontSize: '0.8rem', 
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: '0.8rem', 
                      width: '32px', 
                      height: '32px', 
                    },
                    '& .MuiPickersMonth-root': {
                      color: '#000', // Month text color
                    },
                    '& .MuiPickersMonth-monthButton': {
                        '&.Mui-selected': {
                          backgroundColor: '#4758DC', // Selected month background color
                          color: '#fff', // Selected month text color
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#3747AC', // Hover background color for selected month
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(71, 88, 220, 0.1)', // Hover background color
                        },
                    }
                  }}
                />
            </LocalizationProvider>
          </div>
        )}
      <div className="statsitcs-content">
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
                  <div className="log-card-date">{toDateObject(expense.date).format('DD/MM')}</div>
                  <div className="log-card-category">{getCategoryIcon(expense.category)}</div>
                  <div className="log-card-description">{expense.description}</div>
                  <div className="log-card-amount">{currencySymbol}{expense.amount}</div>
                  <IconButton 
                    size="small" 
                    sx={{color: "#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"}}} 
                    onClick={()=>handleDeleteExpense(expense.id)}>
                    <RiDeleteBinLine/>
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditModal(expense)}
                  >
                    <RiEdit2Line/>
                  </IconButton>
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
    </>
  );
};

export default Statistics;