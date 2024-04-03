import React from 'react';
import NavBar from './Components/NavBar/Navbar';
import Account from './Components/Account/Account';
import Settings from './Components/Settings/Settings';
import Statistics from './Components/Statistics/Statistics';
import './App.css';
import { Tab } from './Components/NavBar/Tab';
import { Currencies } from './Components/Expenses/Currencies';


const App: React.FC = () => {
  
  const [currentTab, setCurrentTab] = React.useState<Tab>(Tab.ACCOUNT);
  const [currency, setCurrency] = React.useState<string>('EUR');
  const [budget, setBudget] = React.useState<number>(1000);
  const [currencySymbol, setCurrencySymbol] = React.useState<string>('€');

  const renderTabContent = () => {
    switch(currentTab){
      case Tab.ACCOUNT:
        return <Account/>;
      case Tab.SETTINGS:
        return <Settings 
                  currency ={currency} 
                  setCurrency={setCurrency} 
                  budget={budget} 
                  setBudget={setBudget} 
                  currencySymbol={currencySymbol}
                  onSave={(newCurrency, newBudget) => {
                    setCurrency(newCurrency);
                    setBudget(newBudget);
                  }}
              />;
      case Tab.STATISTICS:
        return <Statistics currency={currency} budget={budget} currencySymbol={currencySymbol} onDeleteExpense={function (expenseId: string): void {
          throw new Error('Function not implemented.');
        } }/>;
    }
  }

  // update currency symbol based on the selection
  React.useEffect(() => {
    const selectedCurrency = Currencies.find((curr) => curr.value === currency);
    if (selectedCurrency) {
      setCurrencySymbol(selectedCurrency.symbol);
    }
  }, [currency])

 

  return (
      
      <div className="App">
        <div className="app-content">
        {renderTabContent()}
        </div> 
        <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>

  );
}

export default App;
function useSate<T>() {
  throw new Error('Function not implemented.');
}

