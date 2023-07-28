import { useEffect, useState } from 'react';

interface IUser {
    id: number;
    fName: string;
    lName: string;
    avatar: Blob;
}

export default function User() {
    const [users, setUsers] = useState([] as IUser[]);
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
            <div className="flex flex-col justify-center">
                {users.map((user) => (
                    <div key={user.id} className="flex flex-row pb-1 gap-1">
                        <div className="w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none">
                            <img
                                className="border-none outline-none"
                                src={user.avatar.toString()}
                                alt=""
                            />
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
                ))}
            </div>
        </>
    );
}
