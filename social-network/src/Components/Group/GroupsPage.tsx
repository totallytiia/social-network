import { useState } from 'react';
import GroupList from './GroupList';
import CreateGroup from './CreateGroup';

export default function Groups() {
    const [createNewGroup, setCreateNewGroup] = useState(false);
    function handleCreateNewGroup() {
        setCreateNewGroup((current) => !current);
    }

    return (
        <div className="bg-custom">
            <div className="flex flex-col lg:flex-row lg:justify-center p-6">
                <div className="flex flex-col lg:w-1/2 bg-white rounded-lg shadow-lg p-4 m-2 h-screen">
                    {!createNewGroup && (
                        <div className="CREATE-GROUP flex justify-center">
                            <button
                                onClick={() => handleCreateNewGroup()}
                                className=" flex flex-row text-lg font-bold items-center gap-1  py-2 pl-1 pr-4 rounded-full hover:bg-blue-50"
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
                                <p className="text-bold text-sm">
                                    Create group
                                </p>
                            </button>
                        </div>
                    )}
                    <div className="mx-auto">
                        {createNewGroup && <CreateGroup />}
                    </div>
                    <h1 className="font-bold text-xl text-center my-2">
                        All Groups
                    </h1>
                    <div className="[&>div]:m-1">
                        <GroupList />
                    </div>
                </div>
            </div>
        </div>
    );
}
