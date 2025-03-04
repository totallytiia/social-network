import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface iFormKeys {
    [key: string]: { [key: string]: string | number | boolean | undefined };
}

interface iForm extends iFormKeys {
    groupCreate: {
        name: string;
        description: string;
    };
}

interface Props {
    setGroupCreated: (value: boolean) => void;
}

export default function CreateGroup(props: Props) {
    const { setGroupCreated } = props;
    const [formData, setFormData] = useState({
        groupCreate: {
            name: '',
            description: '',
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
        const target = e.target;
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
        const url = 'http://localhost:8080/api/groups/create';
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        (document.getElementById('name') as HTMLInputElement).value = '';
        (document.getElementById('description') as HTMLInputElement).value = '';

        const data = await res.json();
        if (data.errors) {
        }
        setFormVisibility(false);
        if (setGroupCreated !== undefined) {
            setGroupCreated(true);
        }
    }

    const [formVisibility, setFormVisibility] = useState(true);

    if (!formVisibility) {
        return (
            <div className="">
                <button
                    onClick={() => setFormVisibility(true)}
                    className="flex flex-row text-lg font-bold shadow-md items-center gap-1 bg-blue-50 py-2 pl-1 pr-4 rounded-full hover:bg-blue-100"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                    <p className="text-bold text-sm">Create group</p>
                </button>
            </div>
        );
    }

    return (
        <div className="create-group flex flex-col align-center justify-center items-center bg-blue-50 rounded-xl p-6 shadow-md mt-2">
            <div className="create-group__header"></div>
            <div className="create-group__form w-full p-2">
                <form onSubmit={handleFormSubmit} name="groupCreate">
                    <label htmlFor="">Create a group</label>
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
                    <div className="flex flex-row gap-2 justify-center">
                        <div
                            onClick={() => setFormVisibility(false)}
                            className="button-custom text-center bg-blue-100 font-bold text-sm rounded-full mt-2 py-2 px-4"
                        >
                            <button>Cancel</button>
                        </div>
                        <input
                            type="submit"
                            value="Submit"
                            className="button-custom text-center bg-blue-100 font-bold text-sm rounded-full mt-2 py-2 px-4"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
