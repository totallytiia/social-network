import { useState, createContext } from 'react';

import Header from './Components/Header/Header';
import Posts from './Components/Posts/Posts';
import Footer from './Components/Footer/Footer';
import './styles.css';

interface ApiUserContextInterface {
    id: number;
    name: string;
    username: string;
    email: string;
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
            <UserContext.Provider value={{ userData, setUserData }}>
                <Header />
                <Posts />
                <Footer />
            </UserContext.Provider>
        </>
    );
}

export default App;
