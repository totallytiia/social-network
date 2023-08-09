import { useEffect, useState } from 'react';
import GroupIcon from './GroupIcon';

export default function Group() {
    interface Group {
        id: number;
        name: string;
        description: string;
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
            if (!data.errors) {
                setGroups(data);
                console.log(data);
            }
        }
        getGroups();
    }, []);

    return (
        <div>
            {groups.map((group) => {
                return (
                    <div className="bg-blue-50 rounded-xl p-2">
                        <div
                            key={group.id}
                            className="flex flex-row items-center gap-2"
                        >
                            <a
                                href={`/group/${group.id}`}
                                className="p-1 text-sm font-normal flex flex-row gap-2"
                            >
                                <GroupIcon />
                                <div className="my-auto">{group.name}</div>
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
