import { UserContext } from "../App/App";
import { useContext, useState } from "react";

interface iFormKeys {
	[key: string]: {
		[key: string]: string | number | undefined;
	};
}

interface iForm extends iFormKeys {
	event: {
		name: string;
		description: string;
		date: string;
		startTime: string;
		endTime: string;
		creator: string;
	};
}


export default function CreateEvent() {

	const { userData } = useContext(UserContext);

	const [eventData, setEventData] = useState<iForm>({
		event: {
			name: "",
			description: "",
			date: "",
			startTime: "",
			endTime: "",
			creator: "",
		},
	});

	const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const FD = new FormData();
		FD.append("name", eventData.event.name);
		FD.append("description", eventData.event.description);
		FD.append("date", eventData.event.date);
		FD.append("startTime", eventData.event.startTime);
		FD.append("endTime", eventData.event.endTime);
		FD.append("creator", userData.id.toString());
		const response = await fetch("http://localhost:8080/api/event/create", {
			method: "POST",
			credentials: "include",
			body: FD,
		});
		if (response.ok) {
			const data = await response.json();
			console.log(data);
		} else {
			console.log("something went wrong");
		}
	};



	return (
		<>
			<div className="create-event m-2">
				<div className="create-event__header text-xl font-bold text-center">
					<h2>Create your event</h2>
				</div>
				<div className="create-event__form">
					<form
						onSubmit={(e) => {
							handleEventSubmit(e);
						}
						}
						className="bg-blue-50 p-6 rounded-xl">
						<div className="form__group mt-1 ">
							<input className="w-full" type="text" name="name" id="name" placeholder="Event name"
								onChange={(e) => {
									const eventCopy = eventData;
									eventCopy.event.name = e.target.value;
									setEventData(eventCopy);
								}} />
						</div>
						<div className="form__group mt-2">
							<textarea
								onChange={(e) => {
									const eventCopy = eventData;
									eventCopy.event.description = e.target.value;
									setEventData(eventCopy);
								}
								}
								className="w-full rounded-md mb-0 text-sm p-2" name="description" id="description" placeholder="Describe this event" />
						</div>
						<div className="form__group mt-1">
							<input
								onChange={(e) => {
									const eventCopy = eventData;
									eventCopy.event.date = e.target.value;
									setEventData(eventCopy);
								}}
								type="date" className="mt-0 w-full" name="date" id="date" placeholder="date" />
						</div>
						<div className="form__group mt-1">
							<input
								onChange={(e) => {
									const eventCopy = eventData;
									eventCopy.event.startTime = e.target.value;
									setEventData(eventCopy);
								}
								}
								type="time" className="mt-0 w-full" name="startTime" id="startTime" placeholder="start time" />
						</div>
						<div className="form__group mt-1">
							<input
								onChange={(e) => {
									const eventCopy = eventData;
									eventCopy.event.endTime = e.target.value;
									setEventData(eventCopy);
								}
								}
								type="time" className="mt-0 w-full" name="endTime" id="endTime" placeholder="end time" />
						</div>
						<div className="form__group button-custom text-center bg-blue-100 font-bold rounded-xl mt-2 p-2">
							<button >Create event</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}