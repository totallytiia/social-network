

export default function CreateGroup() {
	return (
		<div className="create-group flex flex-col align-center justify-center items-center">
			<div className="create-group__header">
			</div>
			<div className="create-group__form w-full p-2">
				<form className="">
					<label htmlFor="">Create group</label>
					<div className="form__group mt-1">
						<input className="w-full" type="text" name="name" id="name" placeholder="Group's name" />
					</div>
					<div className="form__group mt-2">
						<textarea className="rounded-lg text-sm p-2 w-full" name="description" id="description" placeholder="Describe the group" />
					</div>
					<div className="form__group flex flex-row items-center gap-1 mt-1">
						<label className="mb-0" htmlFor="private">Private</label>
						<input className="items-center" type="checkbox" name="private" id="private" />
					</div>
					<div className="form__group mt-2">
						<input className="w-full" type="text" name="invite" id="invite" placeholder="Invite friends" />
					</div>
					<div className="form__group button-custom text-center bg-blue-100 font-bold rounded-xl mt-2 p-2">
						<button>Create group</button>
					</div>
				</form>
			</div >
		</div >
	);
}