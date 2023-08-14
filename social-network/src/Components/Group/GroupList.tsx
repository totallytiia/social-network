import { useEffect, useState } from 'react';
import GroupIcon from './GroupIcon';
import { Link } from 'react-router-dom';

export default function Group() {
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
            const groupsData = data.map((group: any) => {
                return {
                    id: group.group_id,
                    name: group.group_name,
                    description: group.group_description,
                    members: group.group_members,
                    owner: group.group_owner,
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
                    <div className="bg-blue-50 rounded-xl" key={group.id}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="p-1 text-sm font-normal flex flex-row gap-2">

                                <Link
                                    to={`/group/${group.id}`}
                                    key={`groupLink-${group.id}`}
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
