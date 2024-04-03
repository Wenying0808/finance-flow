import React, {createContext, useState, useContext, ReactNode} from 'react';

interface UserContextProps {
    children: ReactNode;
};

const UserContext = createContext<any>(null);

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProps> = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);

    return(
        <UserContext.Provider value={{ uid, setUid}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;