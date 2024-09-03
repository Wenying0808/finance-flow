import React from 'react';
import NavBar from './Components/NavBar/Navbar';
import Account from './Components/Account/Account';
import Settings from './Components/Settings/Settings';
import Statistics from './Components/Statistics/Statistics';
import './App.css';
import { Tab } from './Components/NavBar/Tab';
import { Currencies } from './Components/Expenses/Currencies';
import { useUserContext } from './Contexts/UserContextProvider';
import { ThemeProvider} from './Components/Theme/ThemeContext';

const App: React.FC = () => {
  const { uid,  userDocId, currency, setCurrency, budget, setBudget, currencySymbol, setCurrencySymbol, db } = useUserContext();

  const [currentTab, setCurrentTab] = React.useState<Tab>(Tab.ACCOUNT);

  const renderTabContent = () => {
    switch(currentTab){
      case Tab.ACCOUNT:
        return <Account/>;
      case Tab.SETTINGS:
        return <Settings />;
      case Tab.STATISTICS:
        return <Statistics onDeleteExpense={function (expenseId: string): void {
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
  }, [currency, setCurrencySymbol])

  return (
      <ThemeProvider>
        <div className="App">
          <div className="app-content">
          {renderTabContent()}
          </div> 
          <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
      </ThemeProvider>
  );
}

export default App;




