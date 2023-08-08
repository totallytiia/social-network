import { useEffect, useState } from 'react';
import { useHref } from 'react-router-dom';

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

    return <><div></div></>;
}
