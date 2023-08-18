import { useEffect, useState } from 'react';
import ProfileIcon from '../Profile/ProfileIcon';
import { Link } from 'react-router-dom';
interface IUser {
    id: number;
    fName: string;
    lName: string;
    avatar: Blob;
}

export default function UsersSidebar() {
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
            <div className="order-2 lg:mx-0 mx-auto w-9/12 lg:max-w-xs">
                <div className="bg-white shadow rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">Users</h1>
                    <div className="flex flex-col justify-center">
                        {users.map((user) => (
                            <Link
                                to={`/user/${user.id}`}
                                key={`userLink-${user.id}`}
                            >
                                <div
                                    key={user.id}
                                    className="flex flex-row mb-1.5 py-1 pl-2 pr-4 gap-1 bg-blue-50 rounded-full w-fit"
                                >
                                    <div className="w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none">
                                        <img
                                            className="border-none outline-none"
                                            src={user.avatar.toString()}
                                            alt=""
                                        />
                                        <ProfileIcon classNames="w-8 h-8" />
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
