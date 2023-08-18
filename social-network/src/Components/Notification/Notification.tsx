import { XMarkIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { useState, useContext } from 'react';
import { WSContext } from '../WSProvider/WSProvider';

export default function Notification() {
    const { ws } = useContext(WSContext);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notification, setNotification] = useState('' as string);

    if (ws !== null) {
        ws.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            if (data.type === 'chat') {
                setNotificationVisible(true);
                setNotification("You've got a new message!");
            }
        });
    }

    // close notification after 5 seconds
    setTimeout(() => {
        setNotificationVisible(false);
    }, 5000);

    return (
        <div className="flex flex-col">
            {notificationVisible ? (
                <div>
                    <div className="CLOSE_NOTIFICATION flex flex-row justify-end items-center ">
                        <button
                            type="button"
                            className="rounded-full font-medium text-sm mr-1 text-center inline-flex items-center"
                            onClick={() => setNotificationVisible(false)}
                        >
                            <XMarkIcon className="text-gray-600 w-5 h-5" />
                        </button>
                    </div>
                    <div className="bg-white max-w-xs text-sm border border-gray-200 rounded-lg shadow-lg relative px-4 py-2 flex flex-row gap-2">
                        <BellAlertIcon className="text-blue-500 w-5 h-5 shrink-0" />
                        {notification}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
