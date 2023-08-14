import { useState, useEffect } from 'react';
import CreateEvent from './CreateEvent';
import { useParams } from 'react-router-dom';

interface iGroup {
	group_name: string;
	group_description: string;
	created_at: string;
	updated_at: string;
	posts: any[];
}

export default function Group() {

	const [group, setGroup] = useState({} as iGroup);
	const { id } = useParams();

	useEffect(() => {
		async function getGroupData() {
			const url = `http://localhost:8080/api/groups/get?group_id=${id}`;
			const res = await fetch(url, {
				method: 'GET',
				credentials: 'include',
			});
			const data = await res.json();
			if (data.errors) {
				console.log(data);
			}
			console.log(data);
			setGroup(data);
		}
		getGroupData();
	}, []);


	return (
		<div className="bg-custom">
			<div className="p-16 bg-custom z-0 item-center justify-center">
				<div className="p-10 shadow-xl flex flex-col items-center bg-white rounded-xl">
					<div className="grid grid-cols-1 items-center justify-between md:grid-cols-3 ">
						<div className="grid grid-cols-2 text-center order-last md:order-first mt-7 md:mt-0">
							<div>
								<p className="font-bold text-gray-700 text-xl">
									22
								</p>
								<p className="text-gray-400">Members</p>
							</div>
							<div>
								<p className="font-bold text-gray-700 text-xl">
									10
								</p>
								<p className="text-gray-400">Posts</p>
							</div>
						</div>

						<CreateEvent />

						<div className="justify-center gap-6 flex mt-10 md:mt-0 border-b md:border-b-0 pb-8 md:pb-0">

						</div>
					</div>

					<div className="mt-10 text-center border-b pb-12">
						<h1 className="text-4xl font-medium text-gray-700">
							{group.group_name}
							<span className="text-gray-500"></span>
						</h1>
						<p className="text-gray-600 mt-3">{group.group_description}</p>
					</div>

					<div className="mt-12 flex flex-col justify-center">
						<p className="text-gray-600 text-center lg:px-16">
							POSTS
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
