import { Route, Routes } from 'react-router-dom';
import Register from '../Register/Register';
import Login from '../Login/Login';

function SignInOrRegister() {
    return (
        <>
            <Routes>
                <Route path={'/login?'} element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    );
}

export default SignInOrRegister;
