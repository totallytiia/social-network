import { useState } from 'react';
import GroupList from './GroupList';
import CreateGroup from './CreateGroup';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

export default function Groups() {
    const [createNewGroup, setCreateNewGroup] = useState(false);
    const [groupCreated, setGroupCreated] = useState(false);
    function handleCreateNewGroup() {
        setCreateNewGroup((current) => !current);
    }

    return (
        <div className="bg-custom min-h-screen">
            <div className="flex flex-col lg:flex-row lg:justify-center p-6 flex-shrink">
                <div className="flex flex-col order-1 lg:w-1/2 bg-white rounded-lg shadow-lg p-4 m-2 h-screen">
                    <h1 className="font-bold text-xl text-center my-2">
                        All Groups
                    </h1>
                    <div className="[&>div]:m-1">
                        <GroupList
                            groupCreated={groupCreated}
                            setGroupCreated={setGroupCreated}
                        />
                    </div>
                </div>
                <div className="p-2 mt-4 order-0   lg:order-1">
                    {!createNewGroup && (
                        <div className="CREATE-GROUP bg-blue-50 rounded-full shadow-md flex justify-center">
                            <button
                                onClick={() => handleCreateNewGroup()}
                                className=" flex flex-row text-lg font-bold items-center gap-1 py-2 pl-2 pr-4 rounded-full hover:bg-blue-50"
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                                <p className="text-bold text-sm">
                                    Create group
                                </p>
                            </button>
                        </div>
                    )}
                    <div className="mx-auto">
                        {createNewGroup && (
                            <CreateGroup setGroupCreated={setCreateNewGroup} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
