import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection } from "firebase/firestore";
import React, {createContext, useState, useContext, ReactNode} from 'react';

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Access Users collection
const usersRef = collection(db, "Users");

interface UserContextProps {
    children: ReactNode;
};

// Define theme type and toggle function
type Theme = 'light' | 'dark';

interface UserContextType {
    uid: string | null;
    setUid: React.Dispatch<React.SetStateAction<string | null>>;
    userDocId: string | null ;
    setUserDocId: React.Dispatch<React.SetStateAction<string | null>>;
    currency: string;
    setCurrency: React.Dispatch<React.SetStateAction<string>>;
    budget: number;
    setBudget: React.Dispatch<React.SetStateAction<number>>;
    currencySymbol: string;
    setCurrencySymbol: React.Dispatch<React.SetStateAction<string>>;
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const UserContext = createContext<any>(null);
export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProps> = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);
    const [userDocId, setUserDocId] = useState<string | null>(null);
    const [currency, setCurrency] = useState<string>('EUR');
    const [budget, setBudget] = useState<number>(1000);
    const [currencySymbol, setCurrencySymbol] = useState<string>('€');
    const [theme, setTheme] = useState<Theme>('light');

    return(
        <UserContext.Provider value={{ uid, setUid, userDocId, setUserDocId, currency, setCurrency, budget, setBudget, currencySymbol, setCurrencySymbol, theme, setTheme, auth, db, usersRef}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;