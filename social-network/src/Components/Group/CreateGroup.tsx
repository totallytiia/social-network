import { useState } from 'react';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | boolean | undefined;
    };
}

interface iForm extends iFormKeys {
    groupCreate: {
        name: string;
        description: string;
        private: boolean;
        [key: string]: string | number | boolean | undefined;
    };
}

export default function CreateGroup() {
    const [formData, setFormData] = useState({
        groupCreate: {
            name: '',
            description: '',
            private: false,
        },
    } as iForm);

    function formHandleChangeInput(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const form =
            e.target.parentElement?.parentElement?.attributes.getNamedItem(
                'name'
            )?.value as string;
        console.log(form);
        const target = e.target;
        console.dir(target);
        const value = target.value;
        const name = target.name;
        const newFormData = formData;
        newFormData[form][name] = value;
        setFormData({ ...newFormData });
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const FD = new FormData();
        FD.append('group_name', formData.groupCreate.name);
        FD.append('group_description', formData.groupCreate.description);
        FD.append('private', formData.groupCreate.private.toString());
        console.log(formData);
        const url = 'http://localhost:8080/api/groups/create';
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            console.log(data);
        }
        console.log(data);
    }
    return (
        <div className="create-group flex flex-col align-center justify-center items-center">
            <div className="create-group__header"></div>
            <div className="create-group__form w-full p-2">
                <form onSubmit={handleFormSubmit} name="groupCreate">
                    <label htmlFor="">Create group</label>
                    <div className="form__group mt-1">
                        <input
                            className="w-full"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Group's name"
                            onChange={formHandleChangeInput}
                            value={formData.groupCreate.name}
                        />
                    </div>
                    <div className="form__group mt-2">
                        <textarea
                            className="rounded-lg text-sm p-2 w-full"
                            name="description"
                            id="description"
                            placeholder="Describe the group"
                            onChange={formHandleChangeInput}
                            value={formData.groupCreate.description}
                        />
                    </div>
                    <div className="form__group flex flex-row items-center gap-1 mt-1">
                        <label className="mb-0" htmlFor="private">
                            Private
                        </label>
                        <input
                            className="items-center"
                            type="checkbox"
                            name="private"
                            id="private"
                            onChange={formHandleChangeInput}
                            checked={formData.groupCreate.private}
                        />
                    </div>
                    <div className="form__group mt-2">
                        <input
                            className="w-full"
                            type="text"
                            name="invite"
                            id="invite"
                            placeholder="Invite friends"
                            onChange={formHandleChangeInput}
                        />
                    </div>
                    <div className="form__group button-custom text-center bg-blue-100 font-bold rounded-xl mt-2 p-2">
                        <button>Create group</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
