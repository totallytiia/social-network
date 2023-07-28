import { useEffect, useState } from 'react';

interface User {
    id: number;
    fname: string;
    lname: string;
    avatar: Blob;
}

export default function User() {
    const [users, setUsers] = useState([] as User[]);
    useEffect(() => {
        async function getUsers() {
            const url = `http://localhost:8080/api/users/getall`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                console.log('error');
                return;
            }
            const data = await res.json();
            if (!data.errors) {
                console.log(data);
            }
            setUsers(data.users);
        }
        getUsers();
    }, []);
    console.log(users);

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                {users.map((user) => (
                    <div key={user.id} className="flex flex-row">
                        <img
                            className="w-10 h-10 rounded-full"
                            src={URL.createObjectURL(user.avatar)}
                            alt="user"
                        />
                        <p className="text-black">
                            {user.fname} {user.lname}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
