import { useEffect, useState } from 'react';
import GroupIcon from './GroupIcon';
import { Link } from 'react-router-dom';

export default function GroupList() {
    interface Group {
        id: number;
        name: string;
        description: string;
        members: number[];
        owner: number;
    }

    const [groups, setGroups] = useState([] as Group[]);
    useEffect(() => {
        async function getGroups() {
            const url = `http://localhost:8080/api/groups/getall`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok || res.status === 204) {
                return;
            }
            const data = await res.json();
            if (data.errors) {
                console.log(data);
                return;
            }
            setGroups(data);
        }
        getGroups();
    }, []);

    return (
        <>
            {groups.map((group) => {
                return (
                    <div className="bg-blue-50 rounded-xl" key={group.id}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="p-1 text-sm font-normal">
                                <Link
                                    to={`/group/${group.id}`}
                                    key={`groupLink-${group.id}`}
                                    className="flex flex-row items-center gap-2"
                                >
                                    <GroupIcon />
                                    <div className="my-auto">{group.name}</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
