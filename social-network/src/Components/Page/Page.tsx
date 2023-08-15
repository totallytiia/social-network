import Header from '../Header/Header';
import Posts from '../Posts/Posts';
import Footer from '../Footer/Footer';
import FourOneFour from '../FourOneFour/FourOneFour';
import Chat from '../Chat/Chat';
import Groups from '../Group/GroupsPage';
import Group from '../Group/Group';

import { Routes, Route } from 'react-router-dom';
import User from '../Profile/User';

function Page() {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/user/:id" element={<User />} />
                {
                    <Route path="/chat" element={<Chat />} />
              /*  <Route path="/notifications" element={<Notifications />} /> * /}
                    < Route path="/groups" element={<Groups />} />
                <Route path="/group/:id" element={<Group />} />
                {/* <Route path="/new-post" element={<NewPost />} /> */}
                <Route path="*" element={<FourOneFour />} />
            </Routes>
            <Footer></Footer>
        </>
    );
}

export default Page;
