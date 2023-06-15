import { useState, createContext } from 'react';

import Page from '../Page/Page';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';

interface ApiUserContextInterface {
    id: number;
    fName: string;
    lName: string;
    dateOfBirth: string;
    nickname: string;
    email: string;
    about: string;
}

interface UserContextType {
    userData: ApiUserContextInterface;
    setUserData: Function;
}

export const UserContext = createContext({} as UserContextType);

function App() {
    const [userData, setUserData] = useState({} as ApiUserContextInterface);
    return (
        <>
            <BrowserRouter>
                <UserContext.Provider value={{ userData, setUserData }}>
                    <Page></Page>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    );
}

export default App;
