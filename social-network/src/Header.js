import { NavLink } from "./NavLink";
import { useState } from "react";

export function Header() {
	const [isNavOpen, setIsNavOpen] = useState(false);
	return (
		<header className="HEADER bg-white sticky top-0 shadow-lg">
			<nav className="NAVIGATION grid grid-cols-3 gap-3 items-center px-2 py-2 mx-2">
				<div className="LOGO">
					<h1 className="LOGO-TEXT text-black text-2xl font-bold">LOGO</h1>
				</div>
				<div className="SEARCHBAR">
					<form class="flex justify-center">
						<label for="simple-search" class="sr-only">Search</label>
						<div class="relative w-100%">
							<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
							</div>
							<input type="text" id="simple-search" class="SEARCHBAR-INPUT bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
							dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required></input>
						</div>
						<button type="submit" class="SEARCHBAR-SUBMIT p-2.5 ml-2 text-sm font-medium text-black bg-lightgray-400 rounded-lg border border-lightgray-700 hover:bg-lightgray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
							<span class="sr-only">Search</span>
						</button>
					</form>
				</div>
				<section className="MOBILE-MENU flex lg:hidden justify-end">
					<div
						className="HAMBURGER-ICON space-y-2 "
						onClick={() => setIsNavOpen((prev) => !prev)}>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
					</div>

					<div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
						<div
							className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
							onClick={() => setIsNavOpen(false)}>
							<svg
								className="h-8 w-8 text-gray-600"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</div>
						<div className="NAVIGATION-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]">
							<NavLink href="/" text="New post" />
							<NavLink href="/" text="Chat" />
							<NavLink href="/" text="Nofitications" />
							<NavLink href="/" text="Groups" />
							<NavLink href="/" text="Profile" />
						</div>
					</div>
				</section>
				<div className="flex space-x-2 text-xs justify-end DESKTOP-MENU hidden lg:flex">
					<div><NavLink href="/" text="+" /></div>
					<div><NavLink href="/" text="fullscreen-chat" /></div>
					<div><NavLink href="/" text="Nofitications" /></div>
					<div><NavLink href="/" text="Groups" /></div>
					<div><NavLink href="/" text="Profile" /></div>
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
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
		</header >
	);
};
