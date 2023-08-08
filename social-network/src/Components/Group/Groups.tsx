import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App/App";
import CreateEvent from "./CreateEvent";


interface IGroup {
	id: number;
	user_id: number;
	group_name: string;
	group_description: string;
}

export default function Groups() {
	const [createEvent, setCreateEvent] = useState(false);
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

		const joinGroup = async (id: number) => { };

		const handleCreateEvent = () => {
			setCreateEvent(current => !current);
		};



		return (
			<div className="bg-custom">
				<div className="flex flex-col lg:flex-row lg:justify-center p-6">
					<div className="flex flex-col lg:w-1/2 bg-white rounded-lg shadow-lg p-4 m-2 h-screen items-center">
						<h1 className="text-4xl text-black m-2">
							Groups
						</h1>
						{groups.map((group) => (
							<div key={group.id} className="flex flex-row">
								<p className="text-black">{group.group_name}</p>
								<p className="text-black">{group.group_description}</p>
								{/* {group.users.includes(userData.id) ? (
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
							)} */}
							</div>
						))}
						{!createEvent && (
							<div className="CREATE-EVENT">
								<button onClick={() => handleCreateEvent()} className="flex flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-2 pr-4 rounded-full hover:bg-blue-100">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
										<path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
									</svg>
									<p className="">
										Create event
									</p>
								</button>
							</div>
						)}
						{createEvent && <CreateEvent />}
					</div>
				</div>
			</div >
		);
	}
}
