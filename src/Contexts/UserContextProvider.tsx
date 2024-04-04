import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, {createContext, useState, useContext, ReactNode} from 'react';


export const firebaseConfig = {
    apiKey: "AIzaSyDWajFmlQ1rtmLEqrDxq5ytF6w2hktj_fc",
    authDomain: "finance-flow-ebfc3.firebaseapp.com",
    projectId: "finance-flow-ebfc3",
    storageBucket: "finance-flow-ebfc3.appspot.com",
    messagingSenderId: "532090806268",
    appId: "1:532090806268:web:886f032786f846be11dc79",
    measurementId: "G-9KNBRJQFLR"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

interface UserContextProps {
    children: ReactNode;
};

interface UserContextType {
    uid: string | null;
    setUid: React.Dispatch<React.SetStateAction<string | null>>;
    currency: string;
    setCurrency: React.Dispatch<React.SetStateAction<string>>;
    budget: number;
    setBudget: React.Dispatch<React.SetStateAction<number>>;
    currencySymbol: string;
    setCurrencySymbol: React.Dispatch<React.SetStateAction<string>>;
}

const defaultUserContext: UserContextType = {
    uid: null,
    setUid: () => {},
    currency: 'EUR',
    setCurrency: () => {},
    budget: 1000, 
    setBudget: () => {},
    currencySymbol: '€',
    setCurrencySymbol: () => {},
};

const UserContext = createContext<any>(null);
export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProps> = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);
    const [currency, setCurrency] = useState<string>('EUR');
    const [budget, setBudget] = useState<number>(1000);
    const [currencySymbol, setCurrencySymbol] = useState<string>('€');

    return(
        <UserContext.Provider value={{ uid, setUid, currency, setCurrency, budget, setBudget, currencySymbol, setCurrencySymbol, auth, db}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;