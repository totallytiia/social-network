import { useState, createContext, useEffect } from 'react';

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
    aboutMe: string;
    avatar: Blob;
}

interface UserContextType {
    userData: ApiUserContextInterface;
    setUserData: Function;
}

export const UserContext = createContext({} as UserContextType);

function App() {
    const [userData, setUserData] = useState({} as ApiUserContextInterface);
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const response = await fetch('http://localhost:8080/api/validate', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (!data.errors) {
                setAuthenticated(true);
            }
        }
        async function getUserData() {
            const response = await fetch(
                'http://localhost:8080/api/users/get',
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (!data.errors) {
                setUserData(data);
            }
        }
        if (isAuthenticated) {
            getUserData();
        }
        checkAuth();
    }, [isAuthenticated]);
    if (!isAuthenticated) {
        return (
            <>
                <BrowserRouter>
                    <UserContext.Provider value={{ userData, setUserData }}>
                        <SignInOrRegister></SignInOrRegister>
                    </UserContext.Provider>
                </BrowserRouter>
            </>
        );
    }
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
