export default function CreateEvent() {
	return (
		<>
			<div className="create-event m-2">
				<div className="create-event__header text-xl font-bold text-center">
					<h2>Create your event</h2>
				</div>
				<div className="create-event__form">
					<form className="bg-blue-50 p-6 rounded-xl">
						<div className="form__group mt-1 ">
							<input className="w-full" type="text" name="name" id="name" placeholder="Event name" />
						</div>
						<div className="form__group mt-2">
							<textarea className="w-full rounded-md mb-0 text-sm p-2" name="description" id="description" placeholder="Describe this event" />
						</div>
						<div className="form__group mt-1">
							<input type="date" className="mt-0 w-full" name="date" id="date" placeholder="date" />
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