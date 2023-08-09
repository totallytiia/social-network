import React, { useEffect } from 'react';

export default function CreateGroup() {
	return (
		<div className="create-group">
			<div className="create-group__header">
				<h2>Create Group</h2>
			</div>
			<div className="create-group__form">
				<form>
					<div className="form__group">
						<label htmlFor="name">Name</label>
						<input type="text" name="name" id="name" />
					</div>
					<div className="form__group">
						<label htmlFor="description">Description</label>
						<textarea name="description" id="description" />
					</div>
					<div className="form__group">
						<label htmlFor="private">Private</label>
						<input type="checkbox" name="private" id="private" />
					</div>
				</form>
			</div>
		</div>
	);
}