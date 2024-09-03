import React, { useState } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, InputAdornment, SelectChangeEvent, IconButton} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Categories } from "./Categories";
import { RiDeleteBinLine } from "react-icons/ri";
import './EditExpense.css';
import { Expense } from "./ExpenseInterface";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dayjs from "dayjs";
import { toDateObject, toDateString } from "./DateHandling";
import { useUserContext } from "../../Contexts/UserContextProvider";
import { useTheme } from "../Theme/ThemeContext";
import colors from "../../colors";


interface EditExpensePageProps {
    expense?: Expense | null | undefined;
    onSave: (expense: Expense) => void;
    onCancel: () => void;
    onDeleteExpense: (expenseId: string) => void;
}

const EditExpensePage: React.FC<EditExpensePageProps> = ({ expense, onSave, onCancel, onDeleteExpense }) => {

    const {currencySymbol, budget, uid,  userDocId, db, usersRef} = useUserContext();
    const {isDarkMode} = useTheme();
    const [formData, setFormData] = useState<Expense>({
        id: expense ? expense.id : '',
        date: expense ? expense.date : toDateString(dayjs()),
        category: expense ? expense.category : '',
        description: expense ? expense.description : '',
        amount: expense ? expense.amount : 0,
    });

    
    const handleDateChange = (newDate: dayjs.Dayjs | null) => {
        if (newDate){
            setFormData((prevData) => ({
                    ...prevData,
                    date: toDateString(newDate)
            }));
        }
    };
    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        const { value } = e.target; //const targetValue = event.target.value;
        setFormData( (prevData) => ({...prevData, category: value}));
    };
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };
    const handleAmountChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setFormData( (prevData) => ({...prevData, amount: parseFloat(value) || 0 }));
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onCancel();
    };


    return (
        <div className="edit-expense-container"
            style={{ backgroundColor: isDarkMode ? colors.MineShaft : colors.White }}
        >
            <div className="page-header">
                <div className="page-header-title"
                    style={{ color: isDarkMode ? colors.Gallery : colors.Black }}
                >
                    Edit Expense
                </div>
                <IconButton  sx={{ color:"#4758DC" ,'&:hover': {backgroundColor:"rgba(71, 88, 220, 0.1)" }}} onClick={onCancel}>
                    <IoIosCloseCircleOutline />
                </IconButton>
            </div>
            <form className="edit-expense-form" onSubmit={handleSubmitForm} >

                <FormControl sx={{ width: '180px' }}>   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={toDateObject(formData.date)}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl sx={{ width: '180px' }}>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                        labelId="category"
                        name="category"
                        value={formData.category}
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
                    name="description"
                    label = "Description"
                    value = {formData.description}
                    onChange={ handleDescriptionChange}
                    required
                />
                
                <TextField
                    sx={{ width: '180px' }} 
                    id="amount"
                    name="amount"
                    label = "Amount"
                    value = {formData.amount}
                    onChange={handleAmountChange}
                    required
                    inputProps={{ 
                        step: "0.01",
                        lang: "en-US"
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                    }} 
                />
                
            </form>

            <div className="edit-expense-buttons">
                <Button 
                    variant="contained" 
                    sx={{
                        color: colors.White,
                        backgroundColor: colors.PersianRed,
                        '&:hover': { 
                            color: colors.White, 
                            backgroundColor: colors.PersianRed
                        }
                    }}
                    startIcon={<RiDeleteBinLine />} 
                    onClick={() => onDeleteExpense(formData.id)}
                >
                    Delete
                </Button>
                <Button 
                    variant="outlined" 
                    sx={{ 
                        color: colors.RoyalBlue, 
                        borderColor: colors.RoyalBlue, 
                        '&:hover': { 
                            color: colors.RoyalBlue, 
                            borderColor: colors.RoyalBlue
                        }
                    }} 
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    type='submit' 
                    sx={{ 
                        color: colors.White,
                        backgroundColor: colors.RoyalBlue,
                        '&:hover': {backgroundColor:colors.RoyalBlue}
                    }} 
                    disabled ={!expense} 
                    onClick={handleSubmitForm}
                >
                    Save
                </Button>
            </div>
            

        </div>
    );

}

export default EditExpensePage;