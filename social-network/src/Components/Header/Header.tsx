import { NavLink } from './NavLink';
import { useState } from 'react';
import { Searchbar } from './Searchbar';

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
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
    return (
        <header className="HEADER bg-white sticky top-0 shadow-lg z-50">
            <nav className="NAVIGATION grid grid-cols-3 gap-3 items-center px-2 py-2 mx-2">
                <div
                    onClick={() => (window.location.href = '/')}
                    className="LOGO"
                >
                    <h1 className="LOGO-TEXT text-black text-2xl font-bold">
                        LOGO
                    </h1>
                </div>
                <Searchbar />
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
                        <div className="NAVIGATION-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]">
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="text-2xl font-extrabold"
                            >
                                Make a post
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="text-2xl font-extrabold"
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="text-2xl font-extrabold"
                            >
                                Notifications
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="text-2xl font-extrabold"
                            >
                                Groups
                            </button>
                            <button
                                onClick={() =>
                                    (window.location.href = '/profile')
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
                <div className="space-x-2 text-xs justify-end DESKTOP-MENU hidden lg:flex">
                    <div onClick={() => (window.location.href = '/')}>
                        <NavLink text="+" />
                    </div>
                    <div onClick={() => (window.location.href = '/')}>
                        <NavLink text="fullscreen-chat" />
                    </div>
                    <div onClick={() => (window.location.href = '/')}>
                        <NavLink text="Nofitications" />
                    </div>
                    <div onClick={() => (window.location.href = '/')}>
                        <NavLink text="Groups" />
                    </div>
                    <div onClick={() => (window.location.href = '/profile')}>
                        <NavLink text="Profile" />
                    </div>
                    <div onClick={Logout}>
                        <NavLink text="Logout" />
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
