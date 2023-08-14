interface INotificationProps {
    notification: {
        id: number;
        follower_id: number;
        message: string;
        created_at: string;
        seen: boolean;
    };
    notificationsState: {
        notifications: {
            id: number;
            follower_id: number;
            message: string;
            created_at: string;
            seen: boolean;
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

    return (
        <div
            id={`notification-${notification.id.toString()}`}
            className="NOTIFICATION flex flex-col"
            onMouseOver={!notification.seen ? markAsSeen : undefined}
        >
            <div
                className={`NOTIFICATION-TEXT flex flex-row justify-between ${
                    !notification.seen ? 'bg-blue-200' : 'bg-blue-50'
                } p-2 my-1 rounded-md`}
            >
                <div className="flex flex-row gap-2">
                    <p className="text-sm">
                        {notification.follower_id}: {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                </div>
                {/* <div className="NOTIFICATION-ACTIONS flex-col flex">
                    <button
                        className="text-xs font-bold"
                        onClick={(e) => deleteNotification(notification.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#e50000"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                </div> */}
            </div>
        </div>
    );
}
