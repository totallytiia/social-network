import Header from '../Header/Header';
import Posts from '../Posts/Posts';
import Footer from '../Footer/Footer';

import { Routes, Route } from 'react-router-dom';

function Page() {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Posts />} />
                {/* <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/new-post" element={<NewPost />} /> */}
            </Routes>
            <Footer></Footer>
        </>
    );
}

export default Page;
