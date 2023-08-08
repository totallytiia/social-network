import Group from "../Group/Group"
import CreateGroup from "../Group/CreateGroup"
import { useState } from "react";

export default function GroupsSidebar() {
    const [createGroup, setCreateGroup] = useState(false);

    function handleCreateGroup() {
        setCreateGroup(current => !current);
    }

    return (
        <>
            <div className=" align-center w-full">
                <div className="bg-blue-50 rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">
                        GROUPS
                    </h1>
                    {!createGroup && (
                        <div className="CREATE-EVENT">
                            <button onClick={() => handleCreateGroup()} className="flex flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-2 pr-4 rounded-full hover:bg-blue-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-bold font-lg">
                                    Create group
                                </p>
                            </button>
                        </div>
                    )}
                    <div className=" mx-auto">
                        {createGroup && <CreateGroup />}
                    </div>
                    <Group />
                </div>
            </div >
        </>
    );
}
