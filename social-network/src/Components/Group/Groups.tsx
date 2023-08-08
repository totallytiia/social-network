import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App/App";


interface IGroup {
	id: number;
	user_id: number;
	group_name: string;
	group_description: string;
	users: number[];
}

export default function Groups() {
	const { userData } = useContext(UserContext);
	const [groups, setGroups] = useState([] as IGroup[]);
	useEffect(() => {
		async function getGroups() {
			const url = `http://localhost:8080/api/groups/getall`;
			const res = await fetch(url, {
				method: "GET",
				credentials: "include",
			});
			if (!res.ok) {
				console.log("error");
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


	const joinGroup = async (id: number) => {

	};


	return (
		<div className="bg-custom">
			<div className="flex flex-col lg:flex-row lg:justify-center">
				<div className="flex flex-col w-1/2 bg-white rounded-lg shadow-lg p-4 m-2 h-screen">
					<h1 className="text-4xl text-black m-2">
						Groups
					</h1>
					{groups.map((group) => (
						<div key={group.id} className="flex flex-row">
							<p className="text-black">{group.group_name}</p>
							<p className="text-black">{group.group_description}</p>
							{group.users.includes(userData.id) ? (
								<button
									onClick={() => {
										window.location.href = `http://localhost:3000/group/${group.id}`;
									}}
								>
									Open
								</button>
							) : (
								<button
									onClick={() => {
										joinGroup(group.id);
									}}
								>
									Join
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div >
	);
}