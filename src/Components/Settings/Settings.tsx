import React, { useEffect, useState } from 'react';
import './Settings.css';
import { TextField, Select, InputLabel, FormControl, MenuItem, InputAdornment, Button, Snackbar, Alert, IconButton } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Currencies } from '../Expenses/Currencies';
import { useUserContext } from '../../Contexts/UserContextProvider';
import { doc, getDoc, setDoc } from "firebase/firestore";


const Settings: React.FC= () => {
  
  //access uid from context
  const {uid, userDocId, currency, setCurrency, budget, setBudget, currencySymbol, db, usersRef} = useUserContext();

  const [newCurrency, setNewCurrency] = useState<string>(currency);
  const [newCurrencySymbol, setNewCurrencySymbol] = useState<string>(currencySymbol);
  const [newBudget, setNewBudget] = useState<number>(budget);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<string>('');


  const handleCurrencyChange = (e: SelectChangeEvent<string>) => {
    const selectedCurrency = Currencies.find(curr => curr.value === e.target.value);
    if(selectedCurrency){
      setNewCurrency(e.target.value as string);
      setNewCurrencySymbol(selectedCurrency.symbol);
    }
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(Number(e.target.value));
  }

  const handleSave = async() => {

    //store to firestore
    try {
      const userDocRef = doc(db, "Users", userDocId);
      await setDoc(userDocRef, {currency: newCurrency, budget: newBudget, uid: uid});

      setCurrency(newCurrency);
      setBudget(newBudget);
      console.log("User settings updated successfully!");

      //show alert
      setOpenAlert(true);
      setAlertSeverity('success'); 

    } catch (error) {
      console.error("Error updating user settings:", error);
      setOpenAlert(true);
      setAlertSeverity('error'); 
    }

  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  return (
    
    <div className="settings-content">

      <FormControl sx={{ width: '180px' }}>
        <InputLabel id="currency">Currency</InputLabel>
        <Select 
          labelId='currency' 
          id="currency" 
          value={newCurrency} 
          onChange={handleCurrencyChange} 
        >
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
          startAdornment: <InputAdornment position="start">{newCurrencySymbol}</InputAdornment>,
        }} 

        value={newBudget} 
        onChange={handleBudgetChange}

        required/>
      
      <Button variant="contained" sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}} onClick={handleSave}>Save</Button>
      
      {/*<div>uid:{uid}</div>*/}
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {alertSeverity === "success" 
        ? <Alert severity="success" onClose={handleAlertClose}>Settings saved successfully!</Alert>
        : <Alert severity="error" >Error saving settings. Please try again.</Alert>
        }
      </Snackbar>
      
    </div>
  );
};

export default Settings;