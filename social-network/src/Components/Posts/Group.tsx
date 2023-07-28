import { useEffect, useState } from 'react';

export default function Group() {
    interface Group {
        id: number;
        name: string;
        description: string;
    }

    const [groups, setGroups] = useState([] as Group[]);
    useEffect(() => {
        async function getGroups() {
            const url = `http://localhost:8080/api/groups`;
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
        }
        getGroups();
    }, []);

    return (
        <>
            <div className="flex flex-row items-center justify-center">
                {groups.map((group) => (
                    <div key={group.id} className="flex flex-row">
                        <p className="text-black">{group.name}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
