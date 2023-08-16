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
            console.log(data);
        }
        setFormVisibility(false);
        console.log(props);
        if (setGroupCreated !== undefined) {
            console.log('something happened');
            setGroupCreated(true);
        }
    }

    const [formVisibility, setFormVisibility] = useState(true);

    if (!formVisibility) {
        return (
            <div className="">
                <button
                    onClick={() => setFormVisibility(true)}
                    className="flex flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-1 pr-4 rounded-full hover:bg-blue-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-bold text-sm">Create group</p>
                </button>
            </div>
        );
    }

    return (
        <div className="create-group flex flex-col align-center justify-center items-center bg-blue-50 rounded-xl p-6 border-2 border-white mt-2">
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
