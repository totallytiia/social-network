import { useEffect, useState } from 'react';

export default function Group() {
    interface Group {
        id: number;
        name: string;
        description: string;
        owner: number;
        members: number[];
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
            const groupsData = data.map((group: any) => {
                return {
                    id: group.group_id,
                    name: group.group_name,
                    description: group.group_description,
                    owner: group.group_owner,
                    members: group.group_members,
                } as Group;
            });
            setGroups(groupsData);
        }
        getGroups();
    }, []);

    return (
        <>
            {groups.map((group) => {
                return (
                    <div
                        key={group.id}
                        className="flex flex-row items-center gap-2"
                    >
                        <a
                            href={`/group/${group.id}`}
                            className="text-xl font-bold text-blue-500"
                        >
                            {group.name}
                        </a>
                    </div>
                );
            })}
        </>
    );
}
