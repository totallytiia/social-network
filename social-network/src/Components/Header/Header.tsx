import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App/App';
import { Link } from 'react-router-dom';
import Groups from '../Group/GroupsPage';

interface INotification {
    id: number;
    message: string;
    type: string;
    user_id: number;
    follower_id: number;
    createdAt: string;
}

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [notifications, setNotifications] = useState([] as INotification[]);
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
        }
        getNotifications();
    }, []);

    const { userData } = useContext(UserContext);

    // remove notification from database
    async function deleteNotification(id: number) {
        const url = `http://localhost:8080/api/notifications/delete`;
        const FD = new FormData();
        FD.append('id', id.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setNotifications(
            notifications.filter((notification: any) => notification.id !== id)
        );
    }

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
                            <button className="text-2xl font-extrabold">
                                Make a post
                            </button>
                            <button className="text-2xl font-extrabold">
                                Chat
                            </button>
                            <button className="text-2xl font-extrabold">
                                Notifications
                            </button>
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
                <div className="DESKTOP-MENU space-x-2 text-xs justify-end  hidden lg:flex">
                    <div>
                        <div className="text-black bg-gray-200 hover:bg-gray-300 focus:bg-gray-300  py-2 px-3 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div
                            onClick={handleButtonClick}
                            id="NOTIFICATIONS-BUTTON"
                            className=" cursor-pointer relative text-black bg-gray-200 hover:bg-gray-300 focus:bg-gray-300  py-2 px-3 rounded-full"
                        >
                            Notifications
                            {notifications.length > 0 && (
                                <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {notifications.length}
                                </div>
                            )}
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
                                className="flex absolute top-14 right-2 bg-white shadow-lg rounded-lg w-96"
                            >
                                <div
                                    id="NOTIFICATIONS-CONTAINER-HEADER"
                                    className=" flex flex-col  w-full px-2 py-1 border-b border-gray-200"
                                >
                                    <h1 className="text-lg font-bold">
                                        Notifications
                                    </h1>
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            id={notification.id.toString()}
                                            className="NOTIFICATION flex flex-col"
                                        >
                                            <div className="NOTIFICATION-TEXT flex flex-row justify-between bg-blue-50 p-2 my-1 rounded-md">
                                                <div className="flex flex-row gap-2">
                                                    <p className="text-sm">
                                                        {
                                                            notification.follower_id
                                                        }
                                                        : {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {notification.createdAt}
                                                    </p>
                                                </div>
                                                <div className="NOTIFICATION-ACTIONS flex-col flex">
                                                    <button
                                                        className="text-xs font-bold"
                                                        onClick={(e) =>
                                                            deleteNotification(
                                                                notification.id
                                                            )
                                                        }
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
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* <button className="text-xs font-bold">
                                        Mark all as read
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-black bg-gray-200 hover:bg-gray-300 focus:bg-gray-300  py-2 px-3 rounded-full">
                        <Link to="/groups">Groups</Link>
                    </div>
                    <div className="text-black bg-gray-200 hover:bg-gray-300 focus:bg-gray-300  py-2 px-3 rounded-full">
                        <Link to={`/user/${userData.id}`}>Profile</Link>
                    </div>
                    <div
                        onClick={Logout}
                        className="text-black bg-gray-200 hover:bg-gray-300 focus:bg-gray-300  py-2 px-3 rounded-full"
                    >
                        <Link to="/">Log out</Link>
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
