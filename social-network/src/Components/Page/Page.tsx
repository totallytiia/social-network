import Header from '../Header/Header';
import Posts from '../Posts/Posts';
import Footer from '../Footer/Footer';
import FourOneFour from '../FourOneFour/FourOneFour';
import Groups from '../Group/GroupsPage';
import Group from '../Group/Group';

import { Routes, Route } from 'react-router-dom';
import User from '../Profile/User';
import Login from '../Login/Login';
import Register from '../Register/Register';

function Page({ isAuthenticated }: any) {
    return (
        <>
            {isAuthenticated ? <Header /> : null}
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/register" element={<Register />} />
                        <Route path="/*" element={<Login />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Posts />} />
                        <Route path="/user/:id" element={<User />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/group/:id" element={<Group />} />
                        <Route path="*" element={<FourOneFour />} />
                    </>
                )}
            </Routes>
            {isAuthenticated ? <Footer /> : null}
        </>
    );
}

export default Page;
