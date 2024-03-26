import React from 'react';
import './Settings.css';
import { TextField, Select, InputLabel, FormControl, MenuItem, InputAdornment } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Currencies } from '../Expenses/Currencies';


interface SettingsProps {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;

  budget: number;
  setBudget: React.Dispatch<React.SetStateAction<number>>;

  currencySymbol: string;
}

const Settings: React.FC<SettingsProps> = ({ currency, setCurrency, budget, setBudget, currencySymbol }) => {

  const handleCurrencyChange = (e: SelectChangeEvent<string>) => {
    setCurrency(e.target.value as string);
  }

  /*const handleStartDateChange = (e: SelectChangeEvent<number>) => {
    setStartDate(e.target.value as number);
  }*/

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(Number(e.target.value));
  }


  const dates: {value: number; label: string}[] = [];
  for (let i = 1; i <= 31; i++){
    let label: string;
    switch(i) {
      case 1:
      case 21:
      case 31:
        label = `${i}st`;
        break;
      case 2:
      case 22:
        label = `${i}nd`;
        break;
      case 3:
      case 23:
        label = `${i}rd`;
        break;
      default:
        label = `${i}th`;    
    }
    dates.push({ value: i, label });
  }

  return (
    
    <div className="settings-content">
      <FormControl sx={{ width: '180px' }}>
        <InputLabel id="currency">Currency</InputLabel>
        <Select labelId='currency' id="currency" value={currency} onChange={handleCurrencyChange} >
          {Currencies.map((currencyOption) => (
            <MenuItem key={currencyOption.value} value={currencyOption.value}>{currencyOption.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
        
      {/*<FormControl sx={{ width: '180px' }}>
        <InputLabel id="starting-date">Starting Date of Month</InputLabel>
        <Select labelId="starting-date" id="starting-date" value={startDate} onChange={handleStartDateChange} >
          {dates.map((dateOption) => (
            <MenuItem key={dateOption.value} value={dateOption.value}>{dateOption.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
          */}
     

      <TextField 
        sx={{ width: '180px' }} 
        id="budget" 
        label="Budget" 
        variant="outlined"

        InputProps={{
          startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
        }} 

        value={budget} 
        onChange={handleBudgetChange}

        required/>

    </div>
  );
};

export default Settings;