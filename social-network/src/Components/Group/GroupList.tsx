import { useEffect, useState } from 'react';
import GroupIcon from './GroupIcon';
import { Link } from 'react-router-dom';

interface Props {
    groupCreated: boolean;
    setGroupCreated: (value: boolean) => void;
}

export default function GroupList(props: Props) {
    interface Group {
        id: number;
        name: string;
        description: string;
        members: number[];
        owner: number;
    }

    const { groupCreated, setGroupCreated } = props;
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
                return;
            }
            setGroups(data);
            if (setGroupCreated !== undefined) setGroupCreated(false);
        }
        getGroups();
    }, [groupCreated, setGroupCreated]);

    return (
        <>
            {groups.map((group) => {
                return (
                    <div
                        className="bg-blue-50 rounded-full w-fit py-1 pl-2 pr-4 mt-1.5"
                        key={group.id}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="text-sm font-normal">
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
