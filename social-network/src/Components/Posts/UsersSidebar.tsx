import { useEffect, useState } from 'react';
import ProfileIcon from './ProfileIcon';
import { Link } from 'react-router-dom';
interface IUser {
    id: number;
    fName: string;
    lName: string;
    avatar: Blob;
}

export default function UsersSidebar() {
    const [users, setUsers] = useState([] as IUser[]);
    console.log(users);
    useEffect(() => {
        async function getUsers() {
            const url = `http://localhost:8080/api/users/getall`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                setUsers([]);
                return;
            }
            const data = await res.json();
            setUsers(data);
        }
        getUsers();
    }, []);
    return (
        <>
            <div className="order-2 lg:mx-0 mx-auto w-9/12 lg:max-w-xs">
                <div className="bg-blue-50 rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">Users</h1>
                    <div className="flex flex-col justify-center">
                        {users.map((user) => (
                            <Link
                                to={`/user/${user.id}`}
                                key={`userLink-${user.id}`}
                            >
                                <div
                                    key={user.id}
                                    className="flex flex-row pb-1 gap-1"
                                >
                                    <div className="w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none">
                                        <img
                                            className="border-none outline-none"
                                            src={user.avatar.toString()}
                                            alt=""
                                        />
                                        <ProfileIcon classNames="w-8 h-8" />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="white"
                                            viewBox="0 0 24 24"
                                            strokeWidth={0}
                                            stroke="currentColor"
                                            className="w-8 h-8 absolute -translate-x-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-black text-sm my-auto">
                                        {user.fName} {user.lName}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
