import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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


interface UserContextProps {
    children: ReactNode;
};

const UserContext = createContext<any>(null);

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProps> = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);

    return(
        <UserContext.Provider value={{ uid, setUid, auth}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;