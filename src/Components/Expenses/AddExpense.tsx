import React, {useState, useEffect, useCallback} from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, InputAdornment, IconButton} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { toDateObject, toDateString } from "./DateHandling";
import { Categories } from "./Categories";
import { SelectChangeEvent } from "@mui/material";

import './AddExpense.css';
import { Expense } from "./ExpenseInterface";
import { v4 as uuidv4 } from 'uuid';
import { IoIosCloseCircleOutline } from "react-icons/io";

import { useUserContext } from "../../Contexts/UserContextProvider";
import { useTheme } from "../Theme/ThemeContext";
import colors from "../../colors";

interface AddExpensePageProps {
    onSave: (expense: Expense) => void;
    onCancel: () => void;
}

const AddExpensePage: React.FC<AddExpensePageProps> = ({onSave, onCancel }) => {

    const {currencySymbol, budget, uid,  userDocId, db, usersRef} = useUserContext();
    const {isDarkMode} = useTheme();
    const [description, setDescription] = useState<string>('');
    const [category, setCategory]= useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>(toDateString(dayjs()));
    const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);
   
    // handle input changes
    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate) {
            setDate(toDateString(newDate));
            console.log("newDate:", newDate);
        }
    };

    const handleCategoryChange = (e: SelectChangeEvent) => {
        setCategory(e.target.value as string);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value as string);
    }
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value)); 
    };

    // check if all inputs have value (not empty)
    const useCheckInputValidity = (date: string, category: string, description: string, amount: number, ) => {
        return useCallback(() => {
          return description.trim() !== '' && category.trim() !== '' && amount > 0 && date !== '';
        }, [description, category, amount, date]);
    };
    const isInputValid = useCheckInputValidity(date, category, description, amount);

    //address async updates from the inputs
    useEffect(() => {
        setIsSaveEnabled(isInputValid);
    },[isInputValid]);

   

    const handleSave = () => {
        const newExpense: Expense = {
            id: uuidv4(),
            date: date,
            category,
            description,
            amount,  
        };

            onSave(newExpense);
            onCancel(); //close the modal
            console.log("date of newExpense:", newExpense.date);
    };

    return (
        <div className="add-expense-container"
            style={{ backgroundColor: isDarkMode ? colors.MineShaft : colors.White }}
        >
            <div className="page-header">
                <div className="page-header-title"
                    style={{ color: isDarkMode ? colors.Gallery : colors.Black }}
                >
                    Add Expense
                </div>
                <IconButton  sx={{ color:"#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"} }} onClick={onCancel}>
                    <IoIosCloseCircleOutline />
                </IconButton>
            </div>
            <div className="add-expense-form" >

                <FormControl sx={{ width: '180px' }}>   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={toDateObject(date)}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl sx={{ width: '180px' }}>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                        value={category}
                        onChange={handleCategoryChange}
                        required
                    >
                        {Categories.map((option)=>{
                            return (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            );    
                        })}
                    </Select>
                </FormControl>

                <TextField
                    sx={{ width: '180px' }} 
                    id="description" 
                    label = "Description"
                    value = {description}
                    onChange={ handleDescriptionChange}
                    required
                />
                
                <TextField
                    sx={{ width: '180px' }} 
                    id="amount" 
                    label = "Amount"
                    value = {amount}
                    onChange={handleAmountChange}
                    required
                    type="number"
                    inputProps={{ 
                        step: "0.01", // Allows two decimal places
                        lang: "en-US" // Ensures period as decimal separator
                    }} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                      }} 
                />  
            </div>
            <div className="add-expense-buttons">
                <Button 
                    variant="outlined" 
                    sx={{ 
                        color:colors.RoyalBlue, 
                        borderColor:colors.RoyalBlue, 
                        '&:hover': { 
                            color:colors.RoyalBlue, 
                            borderColor:colors.RoyalBlue}
                        }} 
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    sx={{ 
                        backgroundColor:colors.RoyalBlue,
                        '&:hover': {
                            backgroundColor:colors.RoyalBlue}
                        }} 
                    onClick={handleSave} 
                    disabled={!isSaveEnabled}
                >
                    Save
                </Button>
            </div>
        </div>
    );

}

export default AddExpensePage;