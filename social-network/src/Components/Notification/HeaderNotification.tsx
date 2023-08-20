import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface INotificationProps {
    notification: {
        id: number;
        follower_id: number;
        message: string;
        created_at: string;
        seen: boolean;
        type: string;
        fname: string;
        lname: string;
        group_id: number;
    };
    notificationsState: {
        notifications: {
            id: number;
            follower_id: number;
            message: string;
            created_at: string;
            seen: boolean;
            type: string;
            fname: string;
            lname: string;
            group_id: number;
        }[];
        setNotifications: any;
    };
}

export default function HeaderNotification(props: INotificationProps) {
    const {
        notification,
        notificationsState: { notifications, setNotifications },
    } = props;

    async function markAsSeen() {
        const url = `http://localhost:8080/api/notifications/seen?id=${notification.id}`;
        const res = await fetch(url, {
            credentials: 'include',
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        notification.seen = true;
        setNotifications(
            notifications.map((noti: any) => {
                if (noti.id === notification.id) {
                    return notification;
                }
                return noti;
            })
        );
    }
    async function followReqRespond(accept: boolean) {
        const url = `http://localhost:8080/api/users/respond`;
        const FD = new FormData();
        FD.append('id', notification.follower_id.toString());
        FD.append('response', accept.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        const notificationsClone = [...notifications];
        notification.type = 'follow';
        notificationsClone[notificationsClone.indexOf(notification)] = {
            ...notification,
        };
        setNotifications(notificationsClone);
    }

    async function groupJoinReqRespond(accept: boolean) {
        const url = `http://localhost:8080/api/groups/respond-group`;
        const FD = new FormData();
        FD.append('group_id', notification.group_id.toString());
        FD.append('user_id', notification.follower_id.toString());
        FD.append('response', accept.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        const notificationsClone = [...notifications];
        notification.type = 'groupJoin';
        notificationsClone[notificationsClone.indexOf(notification)] = {
            ...notification,
        };
        setNotifications(notificationsClone);
    }

    return (
        <div
            id={`notification-${notification.id.toString()}`}
            className="NOTIFICATION flex flex-col"
            onClick={!notification.seen ? markAsSeen : undefined}
        >
            <div
                className={`NOTIFICATION-TEXT flex flex-row justify-between ${
                    !notification.seen ? 'bg-blue-200' : 'bg-blue-50'
                } p-2 my-1  rounded-md `}
            >
                <div className="flex flex-row gap-8">
                    <p className="text-sm">
                        {`${notification.fname} ${notification.lname} `}
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 my-auto">
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                    {notification.type === 'followReq' ? (
                        // Two buttons to respond to follow request
                        <div className="flex flex-row gap-2">
                            <button
                                className="bg-green-500 text-white rounded-full px-2 h-fit py-2 my-auto"
                                onClick={() => followReqRespond(true)}
                            >
                                <CheckIcon className="h-4 w-4 stroke-1.5 stroke-white" />
                            </button>
                            <button
                                className="bg-red-500 text-white rounded-full px-2 h-fit py-2 my-auto"
                                onClick={() => followReqRespond(false)}
                            >
                                <XMarkIcon className="h-4 w-4 stroke-1.5 stroke-white" />
                            </button>
                        </div>
                    ) : null}
                    {notification.type === 'groupJoinReq' ? (
                        <div className="flex flex-row gap-2">
                            <button
                                className="bg-green-500 text-white rounded-full px-2 h-fit py-2 my-auto"
                                onClick={() => groupJoinReqRespond(true)}
                            >
                                <CheckIcon className="h-4 w-4 stroke-1.5 stroke-white" />
                            </button>
                            <button
                                className="bg-red-500 text-white rounded-full px-2 h-fit py-2 my-auto"
                                onClick={() => groupJoinReqRespond(false)}
                            >
                                <XMarkIcon className="h-4 w-4 stroke-1.5 stroke-white" />
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
