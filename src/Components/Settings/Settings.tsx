import React, { useState } from 'react';
import './Settings.css';
import { TextField, Select, InputLabel, FormControl, MenuItem, InputAdornment, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Currencies } from '../Expenses/Currencies';
import { useUserContext } from '../../Contexts/UserContextProvider';
import { doc, setDoc } from "firebase/firestore";




const Settings: React.FC= () => {
  
  //access uid from context
  const {uid, userDocId, currency, setCurrency, budget, setBudget, currencySymbol, db, usersRef} = useUserContext();

  const [newCurrency, setNewCurrency] = useState<string>(currency);
  const [newBudget, setNewBudget] = useState<number>(budget);

  const handleCurrencyChange = (e: SelectChangeEvent<string>) => {
    setNewCurrency(e.target.value as string);
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(Number(e.target.value));
  }

  const handleSave = async() => {

    //store to firestore
    try {
      const userDocRef = doc(db, "Users", userDocId);
      await setDoc(userDocRef, {currency: newCurrency, budget: newBudget, expenses: {}, uid: uid});

      setCurrency(newCurrency);
      setBudget(newBudget);
      console.log("User settings updated successfully!");

    } catch (error) {
      console.error("Error updating user settings:", error);
    }

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