import React, { useState } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, InputAdornment, SelectChangeEvent} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Categories } from "./Categories";

import './EditExpense.css';
import { Expense } from "./ExpenseInterface";


interface EditExpensePageProps {
    currencySymbol: string;
    expense?: Expense | null | undefined;
    onSave: (expense: Expense) => void;
    onCancel: () => void;
    onDeleteExpense: (expenseId: string) => void;
    
}

const EditExpensePage: React.FC<EditExpensePageProps> = ({ currencySymbol, expense, onSave, onCancel, onDeleteExpense }) => {

    const [formData, setFormData] = useState<Expense>({
        id: expense?.id ||'',
        date: expense?.date || '',
        category: expense?.category || '',
        description: expense?.description || '',
        amount: expense?.amount || 0,
        
    });

    
    const handleDateChange = (date: string | null) => {
        setFormData( (prevData) => {
            return {
                ...prevData,
                date: date ? date.toString() : prevData.date
            }
        } );
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

    const handleDelete = (expense: Expense) => {
        onDeleteExpense(expense.id);
        onCancel();
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (expense) {
            handleDelete(expense);
        }
    };


    return (
        <div className="edit-expense-container">
            <div className="page-header">Edit Expense</div>
            <form className="edit-expense-form" onSubmit={handleSubmitForm} >

                <FormControl sx={{ width: '180px' }}>   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={formData.date}
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

                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                      }} 
                />

               
                
            </form>
            <div className="edit-expense-buttons">
                <Button variant="contained" color="error" onClick={handleDeleteClick}>Delete</Button>
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" type='submit' disabled ={!expense} onClick={handleSubmitForm}>Save</Button>
            </div>
            

        </div>
    );

}

export default EditExpensePage;