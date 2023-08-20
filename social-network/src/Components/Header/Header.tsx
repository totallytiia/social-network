import { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from '../App/App';
import { Link } from 'react-router-dom';
import {
    BellIcon,
    ArrowRightOnRectangleIcon,
    UserIcon,
    UserGroupIcon,
} from '@heroicons/react/24/solid';
import HeaderNotification from '../Notification/HeaderNotification';
import { WSContext } from '../WSProvider/WSProvider';

interface INotification {
    id: number;
    message: string;
    type: string;
    user_id: number;
    follower_id: number;
    created_at: string;
    seen: boolean;
    fname: string;
    lname: string;
    group_id: number;
}

export default function Header() {
    const { ws } = useContext(WSContext);

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [notifications, setNotifications] = useState([] as INotification[]);
    const [newNotification, setNewNotification] = useState(false);

    const numUnseenNotifications = useRef(0);

    if (ws !== null)
        ws.addEventListener('message', () => {
            setNewNotification(true);
        });

    useEffect(() => {
        async function getNotifications() {
            const res = await fetch('http://localhost:8080/api/notifications', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) {
                return;
            }
            const data = await res.json();
            if (data.errors) {
                return;
            }
            setNotifications(data);
            setNewNotification(false);
        }
        getNotifications();
    }, [newNotification]);

    useEffect(() => {
        numUnseenNotifications.current = notifications.filter(
            (n) => !n.seen
        ).length;
    }, [notifications]);

    const { userData } = useContext(UserContext);

    async function Logout() {
        const res = await fetch('http://localhost:8080/api/users/logout', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await res.json();
        if (!data.errors) {
            window.location.href = '/';
        }
    }

    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const handleButtonClick = () => {
        setNotificationsOpen((prevOpen) => !prevOpen);
    };

    const handleOverlayClick = () => {
        setNotificationsOpen(false);
    };

    const handleContainerClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if ((event.target as Element).id === 'NOTIFICATIONS-BUTTON') {
            setNotificationsOpen(false);
        }
    };

    return (
        <header className="HEADER bg-white sticky top-0 shadow-lg z-50">
            <nav className="NAVIGATION grid grid-cols-2 gap-3 items-center px-2 py-2 mx-2">
                <div className="LOGO">
                    <h1
                        onClick={() => (window.location.href = '/')}
                        className="LOGO-TEXT cursor-pointer text-black text-2xl font-bold"
                    >
                        SOCIAL NETWORK
                    </h1>
                </div>
                <section className="MOBILE-MENU flex lg:hidden justify-end">
                    <div
                        className="HAMBURGER-ICON space-y-2 "
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                    </div>

                    <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
                        <div
                            className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <svg
                                className="h-8 w-8 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <div
                            onClick={() => setIsNavOpen((prev) => !prev)}
                            className="NAVIGATION-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]"
                        >
                            <Link
                                to="/groups"
                                className="text-2xl font-extrabold"
                            >
                                Groups
                            </Link>
                            <button
                                onClick={() =>
                                    (window.location.href = `/user/${userData.id}`)
                                }
                                className="text-2xl font-extrabold"
                            >
                                Profile
                            </button>
                            <button
                                onClick={Logout}
                                className="text-2xl font-extrabold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </section>
                <div className="DESKTOP-MENU space-x-3 text-xs justify-end  hidden lg:flex">
                    <div>
                        <div
                            onClick={handleButtonClick}
                            id="NOTIFICATIONS-BUTTON"
                            className=" cursor-pointer relative bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-full p-2"
                        >
                            <BellIcon className="text-black w-6 h-6 " />
                            {numUnseenNotifications.current > 0 ? (
                                <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
                                    {numUnseenNotifications.current}
                                </div>
                            ) : null}
                        </div>
                        <div
                            className={`fixed left-0 top-0 bottom-0 right-0 w-full ${
                                isNotificationsOpen ? '' : 'hidden'
                            }`}
                            onClick={handleOverlayClick}
                        >
                            <div
                                onClick={handleContainerClick}
                                id="NOTIFICATIONS-CONTAINER"
                                className="flex absolute top-14 right-2 bg-white shadow-lg rounded-lg w-96 overflow-scroll h-2/3"
                            >
                                <div
                                    id="NOTIFICATIONS-CONTAINER-HEADER"
                                    className=" flex flex-col  w-full px-2 py-1 border-b border-gray-200"
                                >
                                    <h1 className="text-lg font-bold">
                                        Notifications
                                    </h1>
                                    {notifications.map((notification) => (
                                        <HeaderNotification
                                            notification={notification}
                                            notificationsState={{
                                                notifications,
                                                setNotifications,
                                            }}
                                            key={notification.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-black bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-2 rounded-full">
                        <Link to="/groups">
                            <UserGroupIcon className="w-6 h-6" />
                        </Link>
                    </div>
                    <div className="text-black bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-2 rounded-full">
                        <Link to={`/user/${userData.id}`}>
                            <UserIcon className="w-6 h-6" />
                        </Link>
                    </div>
                    <div
                        onClick={Logout}
                        className="text-black bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-2 rounded-full"
                    >
                        <Link to="/">
                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </nav>
            <style>{`
                                .hideMenuNav {
        display: none;
      }
                            .showMenuNav {
                                display: block;
                            position: absolute;
                            width: 100%;
                            height: 100vh;
                            top: 0;
                            left: 0;
                            background-color: rgb(255 237 213);
                            z-index: 10;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;
                            align-items: center;
      }
    `}</style>
        </header>
    );
}
