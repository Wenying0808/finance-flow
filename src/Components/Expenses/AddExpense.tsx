import React, {useState, useEffect, useCallback} from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, InputAdornment, IconButton} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Categories } from "./Categories";
import { SelectChangeEvent } from "@mui/material";

import './AddExpense.css';
import { Expense } from "./ExpenseInterface";
import { v4 as uuidv4 } from 'uuid';
import { IoIosCloseCircleOutline } from "react-icons/io";


interface AddExpensePageProps {
    currencySymbol: string;
    onSave: (expense: Expense) => void;
    onCancel: () => void;
}

const AddExpensePage: React.FC<AddExpensePageProps> = ({currencySymbol, onSave, onCancel }) => {

    const [description, setDescription] = useState<string>('');
    const [category, setCategory]= useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>('');
    const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);
   
    //handle input changes
    const handleDateChange = (newDate: string | null) => {
        if (newDate) {
            setDate(newDate);
        }
    }

    const handleCategoryChange = (e: SelectChangeEvent) => {
        setCategory(e.target.value as string);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value as string);
    }
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value)); 
    }

     //check if all inputs have value (not empty)
    const useCheckInputValidity = (description: string, category: string, amount: number, date: string) => {
        return useCallback(() => {
          return description.trim() !== '' && category.trim() !== '' && amount > 0 && date !== '';
        }, [description, category, amount, date]);
      };
    const isInputValid = useCheckInputValidity(description, category, amount, date);

    //address async updates from the inputs
    useEffect(() => {
        setIsSaveEnabled(isInputValid);
    },[isInputValid]);

   

    const handleSave = () => {
        const expense: Expense = {
            id: uuidv4(),
            date,
            category,
            description,
            amount,
            
        };

        onSave(expense);
        onCancel(); //close the modal
    };

    return (
        <div className="add-expense-container">
            <div className="page-header">
                <div className="page-header-title">Add Expense</div>
                <IconButton  sx={{ color:"#4758DC",'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)"} }} onClick={onCancel}>
                    <IoIosCloseCircleOutline />
                </IconButton>
            </div>
            <div className="add-expense-form" >

                <FormControl sx={{ width: '180px' }}>   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={date}
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

                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                      }} 
                />

               
                
            </div>
            <div className="add-expense-buttons">
                <Button variant="outlined" sx={{ color:"#4758DC", borderColor:"#4758DC", '&:hover': { color:"#4758DC", borderColor:"#4758DC"}}} onClick={onCancel}>Cancel</Button>
                <Button variant="contained" sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}} onClick={handleSave} disabled={!isSaveEnabled}>Save</Button>
            </div>
            

        </div>
    );

}

export default AddExpensePage;