import Header from "../Header/Header";


export default function Profile() {
	return (
		<>
			< Header />
			<div className="p-16 bg-custom z-0">
				<div className="p-8 shadow shadow-lg flex flex-col items-center bg-white rounded-xl">
					<div className="grid grid-cols-1 items-center justify-between md:grid-cols-3 md:justify-between">
						<div className="grid grid-cols-2 text-center order-last md:order-first mt-7 md:mt-0">
							<div>
								<p className="font-bold text-gray-700 text-xl">22</p>
								<p className="text-gray-400">Friends</p>
							</div>
							<div>
								<p className="font-bold text-gray-700 text-xl">10</p>
								<p className="text-gray-400">Posts</p>
							</div>
						</div>
						<div className="relative w-48">
							<div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl flex items-center justify-center text-indigo-500">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
							</div>
						</div>

						<div className="justify-center gap-6 flex mt-10 md:mt-0 border-b md:border-b-0 pb-8 md:pb-0">
							<button className="btn-custom">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
								</svg>
							</button>
							<button className="btn-custom">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
								</svg>
							</button>
						</div>
					</div>

					<div className="mt-10 text-center border-b pb-12">
						<h1 className="text-4xl font-medium text-gray-700">FULL NAME<span className="text-gray-500"></span></h1>
						<p className="text-gray-600 mt-3">ABOUT</p>

						<p className="mt-8 text-gray-500">EMAIL</p>
						<p className="mt-2 text-gray-500">BIRTHDAY</p>
					</div>

					<div className="mt-12 flex flex-col justify-center">
						<p className="text-gray-600 text-center lg:px-16">POSTS</p>
						<button
							className="text-blue-600 py-2 px-4  font-medium mt-4"
						>
							Show more
						</button>
					</div>

				</div>
			</div>
		</>
	);
}
