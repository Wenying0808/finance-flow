import React, { useState } from 'react';
import './Settings.css';
import { TextField, Select, InputLabel, FormControl, MenuItem, InputAdornment, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Currencies } from '../Expenses/Currencies';
import { useUserContext } from '../../Contexts/UserContextProvider';


interface SettingsProps {
  onSave: (newCurrency: string, newBudget: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  
  //access uid from context
  const {uid, currency, setCurrency, budget, setBudget, currencySymbol} = useUserContext();
  const [newCurrency, setNewCurrency] = useState<string>(currency);
  const [newBudget, setNewBudget] = useState<number>(budget);

  const handleCurrencyChange = (e: SelectChangeEvent<string>) => {
    setNewCurrency(e.target.value as string);
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(Number(e.target.value));
  }

  const handleSave = () => {
    onSave(newCurrency, newBudget);
  };

  return (
    
    <form className="settings-content">

      <FormControl sx={{ width: '180px' }}>
        <InputLabel id="currency">Currency</InputLabel>
        <Select labelId='currency' id="currency" value={newCurrency} onChange={handleCurrencyChange} >
          {Currencies.map((currencyOption) => (
            <MenuItem key={currencyOption.value} value={currencyOption.value}>{currencyOption.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
     

      <TextField 
        sx={{ width: '180px' }} 
        id="budget" 
        label="Budget" 
        variant="outlined"

        InputProps={{
          startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
        }} 

        value={newBudget} 
        onChange={handleBudgetChange}

        required/>
      
      <Button variant="contained" sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}} onClick={handleSave}>Save</Button>
      <div>uid:{uid}</div>
    </form>
  );
};

export default Settings;