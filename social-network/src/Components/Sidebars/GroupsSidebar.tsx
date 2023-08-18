import GroupList from '../Group/GroupList';
import CreateGroup from '../Group/CreateGroup';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

export default function GroupsSidebar() {
    const [createGroup, setCreateGroup] = useState(false);
    const [groupCreated, setGroupCreated] = useState(false);

    function handleCreateGroup() {
        setCreateGroup((current) => !current);
    }

    return (
        <>
            <div className="lg:mx-0 mx-auto lg:max-w-xs align-center w-9/12">
                <div className="bg-white shadow rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">
                        GROUPS
                    </h1>
                    <GroupList
                        groupCreated={groupCreated}
                        setGroupCreated={setGroupCreated}
                    />
                    <div className="mt-1.5">
                        {!createGroup && (
                            <div className="CREATE-EVENT">
                                <button
                                    onClick={() => handleCreateGroup()}
                                    className="flex flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-2 pr-4 rounded-full hover:bg-blue-100"
                                >
                                    <PlusCircleIcon className="h-6 w-6" />
                                    <p className="text-bold text-sm">
                                        Create a group
                                    </p>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mx-auto">
                        {createGroup && (
                            <CreateGroup setGroupCreated={setGroupCreated} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
