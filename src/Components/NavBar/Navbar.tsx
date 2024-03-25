import React from 'react';
import { LuSettings2 } from "react-icons/lu";
import { LuBarChartBig } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";
import { Tab } from './Tab';

import './NavBar.css';

interface NavBarProps {
    currentTab: Tab;
    setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const NavBar: React.FC<NavBarProps> = ({currentTab, setCurrentTab}) => {

    const handleChangeTab = (tab: Tab) => {
        setCurrentTab (tab);
    };

    return(
        <ul className='navbar'>
            <li className= {`navbar-tab ${currentTab === Tab.ACCOUNT ? 'selected' : ''}`} onClick={() => handleChangeTab(Tab.ACCOUNT)}>
                <LuUserCircle2 />
                <span>Account</span>
            </li>
            
            <li className= {`navbar-tab ${currentTab === Tab.STATISTICS ? 'selected' : ''}`} onClick={() => handleChangeTab(Tab.STATISTICS)}>
                <LuBarChartBig />
                <span>Statistics</span>
            </li>

            <li className={`navbar-tab ${currentTab === Tab.SETTINGS ? 'selected' : ''}`} onClick={() => handleChangeTab(Tab.SETTINGS)}>
                <LuSettings2 /> 
                <span>Settings</span>
            </li>
            
        </ul>
    );
}

export default NavBar;