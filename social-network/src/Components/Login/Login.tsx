import React, { useState, useContext } from 'react';
import { UserContext } from '../App/App';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserData } = useContext(UserContext);
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const FD = new FormData();
        FD.append('email', email);
        FD.append('password', btoa(password));
        const res = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            body: FD,
            credentials: 'include',
        });
        const data = await res.json();
        if (data.errors) {
            console.log(data.errors, data.details);
        }
        setUserData({ id: data.details as number });
    }

    return (
        <>
            <div className="flex items-center justify-center bg-custom h-screen">
                <div className="bg-blue-50 flex flex-col w-80 rounded-lg px-5 py-5">
                    <div className="text-white mt-5">
                        <h1 className="font-bold text-4xl text-center text-black">
                            Welcome
                        </h1>
                        <p className="font-semibold text-black text-center ">
                            Log in to your account here!
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => handleFormSubmit(e)}
                        className="flex flex-col space-y-4 mt-5"
                    >
                        <input
                            type="email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            placeholder="Email"
                            id="Email"
                            className=""
                        ></input>
                        <input
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            placeholder="Password"
                            id="password "
                            className=""
                        ></input>
                        <button className="btn-custom font-semibold">
                            Submit
                        </button>
                    </form>
                    <button
                        onClick={() => (window.location.href = '/register')}
                        className="text-sm text-gray-500 mt-3"
                    >
                        Don't have an account? Register here.
                    </button>
                </div>
            </div>
        </>
    );
}
