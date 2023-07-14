import Header from '../Header/Header';
import Posts from '../Posts/Posts';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import FourOneFour from '../FourOneFour/FourOneFour';

import { Routes, Route } from 'react-router-dom';




function Page() {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                {/*
                <Route path="/chat" element={<Chat />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/new-post" element={<NewPost />} /> */}
                <Route path="*" element={< FourOneFour />} />
            </Routes>
            <Footer></Footer>
        </>
    );
}

export default Page;
