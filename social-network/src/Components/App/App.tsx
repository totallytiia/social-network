import { useState, createContext } from 'react';

import Page from '../Page/Page';
import '../../styles.css';
import { BrowserRouter } from 'react-router-dom';
import SignInOrRegister from '../SignInOrRegister/SignInOrRegister';

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
    // var isAuthenticated = false;
    // async function checkAuth() {
    //     const response = await fetch('http://localhost:8080/api/validate', {
    //         method: 'GET',
    //     });
    //     const data = await response.json();
    //     if (!data.errors) {
    //         isAuthenticated = true;
    //     }
    // }
    // checkAuth();
    /*if (!isAuthenticated) {
        return (
            <>
                <BrowserRouter>
                    <UserContext.Provider value={{ userData, setUserData }}>
                        <SignInOrRegister></SignInOrRegister>
                    </UserContext.Provider>
                </BrowserRouter>
            </>
        );
    }*/
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
