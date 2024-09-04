import React from 'react';
import { LuSettings2 } from "react-icons/lu";
import { LuBarChartBig } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";
import { Tab } from './Tab';
import { useTheme } from '../Theme/ThemeContext';
import './NavBar.css';
import colors from '../../colors';

interface NavBarProps {
    currentTab: Tab;
    setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const NavBar: React.FC<NavBarProps> = ({currentTab, setCurrentTab}) => {
    const {isDarkMode} = useTheme();

    const handleChangeTab = (tab: Tab) => {
        setCurrentTab (tab);
    };

    return(
        <ul 
            className="navbar"
            style={{ 
                backgroundColor: isDarkMode ? colors.MineShaft : colors.White,
                borderTop: isDarkMode ? `1px solid ${colors.Gallery}` : `1px solid ${colors.RoyalBlue}`
            }}
        >
            <li 
                className= {`navbar-tab ${currentTab === Tab.ACCOUNT ? 'selected' : ''} ${isDarkMode ? 'darkmode' : 'lightmode'}`} 
                onClick={() => handleChangeTab(Tab.ACCOUNT)}
            >
                <LuUserCircle2 />
                <span>Account</span>
            </li>
            
            <li 
                className= {`navbar-tab ${currentTab === Tab.STATISTICS ? 'selected' : ''} ${isDarkMode ? 'darkmode' : 'lightmode'}`} 
                onClick={() => handleChangeTab(Tab.STATISTICS)}
            >
                <LuBarChartBig />
                <span>Statistics</span>
            </li>

            <li 
                className={`navbar-tab ${currentTab === Tab.SETTINGS ? 'selected' : ''} ${isDarkMode ? 'darkmode' : 'lightmode'}`} 
                onClick={() => handleChangeTab(Tab.SETTINGS)}
            >
                <LuSettings2 /> 
                <span>Settings</span>
            </li>
            
        </ul>
    );
}

export default NavBar;