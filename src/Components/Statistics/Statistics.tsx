import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './Statistics.css';
import { Button, IconButton, Modal } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import CustomToggleButton from '../ToggleButton/CustomToggleButton';
import { Expense } from '../Expenses/ExpenseInterface';
import AddExpensePage from '../Expenses/AddExpense';
import EditExpensePage from '../Expenses/EditExpense';
import MonthlyDataChart from '../DataChart/MonthlyDataChart';
import dayjs, { Dayjs } from 'dayjs';
import { toDateObject, toDateString, sortExpensesByDate } from "../Expenses/DateHandling";
import { MdFastfood  } from "react-icons/md";
import { FaHeart, FaHome, FaShoppingBasket, FaTrain } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";
import { BsSuitcaseFill } from "react-icons/bs";
import { IconType } from 'react-icons';
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { useUserContext } from '../../Contexts/UserContextProvider';
import { collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";
import { RiDeleteBinLine, RiEdit2Line  } from "react-icons/ri";
import colors from '../../colors';
import { useTheme } from '../Theme/ThemeContext';


interface StatisticsProps {
  onDeleteExpense: (expenseId: string) => void;
}

interface CategoryIconMap {
  [key: string]: IconType; // Map category strings to corresponding icon components
}

const categoryIconMap: CategoryIconMap = {
  'Education': FaBook,
  'Entertainment': IoGameController,
  'Food & Drinks': MdFastfood,
  'Health & Care': FaHeart,
  'Holidays': BsSuitcaseFill,
  'Home & Utilities': FaHome,
  'Shopping': FaShoppingBasket,
  'Transportation': FaTrain,
};

const Statistics: React.FC<StatisticsProps> = ({ onDeleteExpense }) => {

  //access uid from context
  const {currencySymbol, budget, uid, userDocId, db, usersRef} = useUserContext();
  const { isDarkMode } = useTheme();
  const [selectedMonthAndYear, setSelectedMonthAndYear] = useState({month:dayjs().month(), year: dayjs().year()});
  const [isMonthMenuOpen, setMonthMenuOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
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
  };
  const handleViewModeChange = (newView: 'table' | 'chart') => {
    setViewMode(newView);
  };

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
    const IconColor = isDarkMode ? colors.White : colors.Thundora;
    return Icon ? <Icon color={IconColor}/> : '';
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
    // close the month menu after selecting a month
    setMonthMenuOpen(false);
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
      <div className="month-year-control"
        style={{ 
          backgroundColor: isDarkMode ? colors.MineShaft : colors.White,
          borderBottom: isDarkMode ? `2px solid ${colors.Gallery}` : `2px solid ${colors.RoyalBlue}`
        }}
      >
        <span 
          className="month-year-control-header" 
          style={{ 
            color: isDarkMode ? colors.Gallery : colors.MineShaft,
          }}
        >
          {dayjs().month(selectedMonthAndYear.month).year(selectedMonthAndYear.year).format('MM YYYY')}
        </span>
        <IconButton onClick={handleMonthMenu} sx={{ color: isDarkMode ? colors.Gallery : colors.MineShaft }}>
          {isMonthMenuOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </div>
      {isMonthMenuOpen && (
          <div className="month-menu" style={{ backgroundColor: isDarkMode ? colors.Thundora : colors.White}}>
            <div className='year-control'>
              <IconButton 
                sx={{
                  color: colors.RoyalBlue,
                  '&:hover': {
                    backgroundColor: isDarkMode ? colors.Zumtho : "rgba(71, 88, 220, 0.1)"
                  }
                }} 
                aria-label="previous month" onClick={handlePreviousYear}>
              <GrFormPreviousLink />
              </IconButton>
              <span 
                className="year-control-header"
                style={{ color: isDarkMode ? colors.White : colors.Black }}
              >
                {dayjs().year(selectedMonthAndYear.year).format('YYYY')}
              </span>
              <IconButton 
                sx={{
                  color: colors.RoyalBlue,
                  '&:hover': {
                    backgroundColor: isDarkMode ? colors.Zumtho : "rgba(71, 88, 220, 0.1)"
                  }
                }} 
                aria-label="next month" onClick={handleNextYear}>
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
                      color: isDarkMode ? colors.White : colors.Black, // Month text color
                      '&:hover': {
                          color: isDarkMode ? colors.RoyalBlue : colors.Black, 
                        },
                    },
                    '& .MuiPickersMonth-monthButton': {
                        '&.Mui-selected': {
                          backgroundColor: colors.RoyalBlue, // Selected month background color
                          color: colors.White, // Selected month text color
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#3747AC', // Hover background color for selected month
                        },
                        '&:hover': {
                          backgroundColor: isDarkMode ? colors.Zumtho : 'rgba(71, 88, 220, 0.1)', // Hover background color
                        },
                    }
                  }}
                />
            </LocalizationProvider>
          </div>
        )}
      <div className="statsitcs-content">
        <div className="summary"
          style={{ 
            backgroundColor: isDarkMode ? colors.MineShaft : colors.White,
            borderBottom: isDarkMode ? `1px solid ${colors.Gallery}` : `1px solid ${colors.Gallery}`
          }}
        >
          <div className="summary-info">
            <div className="summary-info-header"
              style={{ color: isDarkMode ? colors.Gallery : colors.Black }}
            >
              Budget: 
            </div>
            <div className="summary-info-value budget" style={{ color: colors.RoyalBlue }}>{currencySymbol}{budget}</div>
          </div>
          <div className="summary-info">
            <div className="summary-info-header"
              style={{ color: isDarkMode ? colors.Gallery : colors.Black }}
            >
              Monthly Expense: 
            </div>
            <div className="summary-info-value expense" style={{ color: colors.Lavender }}>{currencySymbol}{monthlyTotalExpense}</div>
          </div>
          <div className="summary-info">
            <div className="summary-info-header"
              style={{ color: isDarkMode ? colors.Gallery : colors.Black }}
            >
              Monthly Balance: 
            </div>
            <div className="summary-info-value balance" style={{ color: colors.Salem }}>{currencySymbol}{monthlyBalance}</div>
          </div>
          <div className="data-view-control">
            <CustomToggleButton view={viewMode} onViewChange={handleViewModeChange}/>
          </div>
        </div>
        <div className="summary-log">
          {viewMode === 'table' 
          ?
            <div className="summary-log-list">
              {filteredExpenses.map((expense, index) => (
                  <div 
                    className="log-card" 
                    key={index} 
                    style={{ borderBottom: isDarkMode ? `1px solid ${colors.Thundora}` : `1px solid ${colors.Gallery}`}}
                  >
                    <div className="log-card-date">{toDateObject(expense.date).format('DD/MM')}</div>
                    <div className="log-card-category">{getCategoryIcon(expense.category)}</div>
                    <div className="log-card-description" style={{ color: isDarkMode ? colors.Gallery : colors.Black }}>{expense.description}</div>
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
          :
            <div className="summary-log-chart">
              <MonthlyDataChart expenses={filteredExpenses} currencySymbol={currencySymbol}/>
            </div>
          }
          
          <div className="summary-log-button"
            style={{ 
              backgroundColor: isDarkMode ? colors.MineShaft : colors.White,
            }}
          >
            <Button 
              variant="contained" 
              sx={{ 
                color: colors.White,
                backgroundColor:"#4758DC",
                '&:hover': { backgroundColor:"#4758DC" }
              }} 
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