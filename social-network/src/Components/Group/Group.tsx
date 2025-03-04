import { useState, useEffect, useContext } from 'react';
import CreateEvent from './CreateEvent';
import { useParams } from 'react-router-dom';
import CreateAPost from '../CreateAPost/CreateAPost';
import Post from '../Posts/Post';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../App/App';
import { PlusIcon, MinusIcon, CheckIcon } from '@heroicons/react/24/solid';

interface iGroup {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    posts: any[];
    members: any[];
    events: any[];
}

interface iUsers {
    id: number;
    fName: string;
    lName: string;
}

export default function Group() {
    const { userData } = useContext(UserContext);
    const [requestSent, setRequestSent] = useState(false);
    const [createAPost, setCreateAPost] = useState(false);
    const [createEvent, setCreateEvent] = useState(false);
    const [group, setGroup] = useState({} as iGroup);
    const { id } = useParams();

    useEffect(() => {
        async function getGroupData() {
            const url = `http://localhost:8080/api/groups/get?group_id=${id}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.errors) {
                return;
            }
            if (data.posts === null) {
                data.posts = [];
            }
            setGroup(data);
        }
        getGroupData();
    }, [id]);

    const handleCreateEvent = () => {
        setCreateEvent((current) => !current);
    };

    const handleCreateAPost = () => {
        setCreateAPost((current) => !current);
    };

    function postAdded(post: any) {
        const groupCopy = { ...group };
        groupCopy.posts.unshift(post);
        setGroup(groupCopy);
    }

    async function sendJoinRequest() {
        if (id === undefined) return;
        const url = `http://localhost:8080/api/groups/join`;
        const FD = new FormData();
        FD.append('group_id', id);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setRequestSent(true);
    }

    async function sendInvite(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (id === undefined) return;
        const url = `http://localhost:8080/api/groups/invite`;
        const tempFD = new FormData(e.target as HTMLFormElement);
        tempFD.forEach(async (value, key) => {
            const FD = new FormData();
            FD.append('group_id', id);
            FD.append('user_id', value.toString());
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: FD,
            });
            const data = await res.json();
            if (data.errors) {
                return;
            }
        });
        e.currentTarget.reset();
    }

    async function respondToEvent(response: boolean, event_id: number) {
        const url = `http://localhost:8080/api/event/respond`;
        const FD = new FormData();
        FD.append('event_id', event_id.toString());
        FD.append('response', response.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setGroup((current) => {
            const newEvents = current.events.map((event: any) => {
                if (event.id === event_id) {
                    if (response) {
                        event.user_going = 1;
                    } else {
                        event.user_not_going = 1;
                    }
                }
                return event;
            });
            return { ...current, events: newEvents };
        });
    }

    const deletePost = async (id: number) => {
        const url = `http://localhost:8080/api/posts/delete`;
        const FD = new FormData();
        FD.append('post_id', id.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setGroup((current) => {
            const newPosts = current.posts.filter((post) => post.id !== id);
            return { ...current, posts: newPosts };
        });
    };

    const [userList, setUserList] = useState([] as iUsers[]);
    useEffect(() => {
        async function getUsers() {
            const url = `http://localhost:8080/api/users/getall`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.errors) {
                return;
            }
            const groupMembers = group.members?.map((member) =>
                parseInt(Object.keys(member)[0])
            );
            const notInGroup = data.filter((user: any) => {
                return !groupMembers?.includes(user.id);
            });
            setUserList(notInGroup);
        }
        getUsers();
    }, [group]);

    if (
        !group.members
            ?.map((member) => parseInt(Object.keys(member)[0]))
            .includes(userData?.id)
    ) {
        return (
            <div className="bg-custom min-h-screen">
                <div className="p-16 bg-custom item-center justify-center flex flex-col lg:flex-row gap-2">
                    <div className="p-6 order-1 lg:order-0 shadow-xl flex flex-col items-center bg-white lg:w-2/3 rounded-xl">
                        <div className="items-center justify-between md:grid-cols-3 ">
                            <div className="relative mt-10  text-center border-b pb-8">
                                <h1 className="text-4xl font-medium text-gray-700">
                                    {group.name}
                                    <span className="text-gray-500"></span>
                                </h1>
                                <p className="text-gray-600 mt-3">
                                    {group.description}
                                </p>
                            </div>
                            <button className="flex shrink-0 text-lg font-semibold mx-auto mt-4 gap-1 bg-blue-200 py-2 pl-2 pr-4 rounded-full hover:bg-blue-300">
                                {requestSent ? (
                                    <div className="flex flex-row gap-1 shrink-0">
                                        <CheckIcon className="w-4 h-4 stroke-1 stroke-black shrink-0 my-auto" />
                                        <p>Requested</p>
                                    </div>
                                ) : (
                                    <div
                                        className="flex flex-row gap-1 shrink-0"
                                        onClick={sendJoinRequest}
                                    >
                                        <PlusIcon className="w-4 h-4 stroke-1 stroke-black  shrink-0 my-auto" />
                                        <p>Request</p>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-custom min-h-screen">
            <div className="p-16 bg-custom item-center justify-center flex flex-col lg:flex-row gap-2 ">
                <div className="EVENTS bg-white lg:mr-4 rounded-xl shadow-lg max-w-xl mx-auto px-8 py-4 lg:px-4 lg:mx-0 ">
                    {group.events !== null && group.events.length !== 0 ? (
                        group.events.map((event: any) => (
                            <div
                                key={`event-${event.id}`}
                                className="EVENTS__ITEM shadow-md rounded-xl p-4 mb-4"
                            >
                                <div className="EVENTS__ITEM__HEADER flex flex-row justify-between">
                                    <div className="EVENTS__ITEM__HEADER__TITLE">
                                        <h1 className="font-bold text-lg text-black">
                                            {event.title}
                                        </h1>
                                    </div>
                                    <div className="EVENTS__ITEM__HEADER__DATE">
                                        <p className="text-xs text-gray-500 my-auto">
                                            {event.start_date_time} -{' '}
                                            {event.end_date_time}
                                        </p>
                                    </div>
                                </div>
                                <div className="EVENTS__ITEM__BODY">
                                    <p className="text-sm text-gray-500">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="EVENTS__ITEM__FOOTER flex flex-row gap-2 justify-end">
                                    {event.user_going ||
                                    event.user_not_going ? (
                                        <>
                                            {event.user_going ? (
                                                <div className="flex flex-row gap-1">
                                                    <CheckIcon className="w-5 h-5 my-auto bg-green-500 rounded-full text-white text-bold p-0.5 stroke-1 stroke-white" />
                                                    <p className="text-sm">
                                                        Going
                                                    </p>
                                                </div>
                                            ) : null}
                                            {event.user_not_going ? (
                                                <div className="flex flex-row gap-1">
                                                    <MinusIcon className="w-5 h-5 my-auto bg-red-500 rounded-full text-white text-bold p-0.5 stroke-1 stroke-white" />
                                                    <p className="text-sm">
                                                        Not going
                                                    </p>
                                                </div>
                                            ) : null}
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="flex gap-1 text-sm"
                                                onClick={() =>
                                                    respondToEvent(
                                                        true,
                                                        event.id
                                                    )
                                                }
                                            >
                                                <PlusIcon className="w-5 h-5 my-auto bg-green-500 rounded-full text-white text-bold p-0.5 stroke-1 stroke-white" />
                                                <p>Join</p>
                                            </button>

                                            <button
                                                className="flex gap-1 text-sm"
                                                onClick={() =>
                                                    respondToEvent(
                                                        false,
                                                        event.id
                                                    )
                                                }
                                            >
                                                <MinusIcon className="w-5 h-5 my-auto bg-red-500 rounded-full text-white text-bold p-0.5 stroke-1 stroke-white" />
                                                <p className="">Decline</p>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-2xl">
                            No events to show
                        </p>
                    )}
                </div>
                <div className="MAIN p-6 order-1 lg:order-0 shadow-xl flex flex-col items-center bg-white lg:w-2/3 lg:max-w-4xl rounded-xl">
                    <div className="items-center justify-between md:grid-cols-3 ">
                        <div className="relative mt-10  text-center border-b pb-8">
                            <h1 className="text-4xl font-medium text-gray-700">
                                {group.name}
                                <span className="text-gray-500"></span>
                            </h1>
                            <p className="text-gray-600 mt-3">
                                {group.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 mt-2 text-center">
                            <div>
                                <p className="font-bold text-gray-700 text-xl">
                                    {!group.members?.length
                                        ? 0
                                        : group.members.length}
                                </p>
                                <p className="text-gray-400">Members</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 text-xl">
                                    {!group.posts?.length
                                        ? 0
                                        : group.posts.length}
                                </p>
                                <p className="text-gray-400">Posts</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 w-full max-w-2xl flex flex-col justify-center">
                        {group.posts !== undefined &&
                        group.posts.length !== 0 ? (
                            group.posts.map((post: any) => (
                                <Post
                                    deletePost={deletePost}
                                    key={post.id}
                                    postInput={post}
                                />
                            ))
                        ) : (
                            <p className="text-center text-2xl">
                                No posts to show
                            </p>
                        )}
                    </div>
                </div>
                <div className="CREATE p-6 order-0 lg:order-1 flex justify-center ">
                    <div className="flex flex-col shrink-0 gap-2 mt-2 md:mt-0 md:pb-0">
                        {!createEvent && (
                            <div className="CREATE-EVENT mt-2 mx-auto lg:mx-0">
                                <button
                                    onClick={() => handleCreateEvent()}
                                    className="flex flex-row text-lg font-bold items-center gap-1 bg-blue-50 shadow-md py-2 pl-2 pr-4 rounded-full hover:bg-blue-100"
                                >
                                    <PlusIcon className="w-4 h-4 my-auto stroke-2 stroke-black" />
                                    <p className="text-bold text-sm ">
                                        Create an event
                                    </p>
                                </button>
                            </div>
                        )}
                        <div className="mx-auto">
                            {createEvent && (
                                <div className="CLOSE_CREATEPOST flex justify-end">
                                    <button
                                        type="button"
                                        className="font-medium text-sm"
                                        onClick={() => handleCreateEvent()}
                                    >
                                        <XMarkIcon className="text-gray-600 w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {createEvent && <CreateEvent groupID={group.id} />}
                        </div>
                        {!createAPost && (
                            <div className="CREATE-EVENT shrink-0 flex mt-2 mx-auto lg:mx-0">
                                <button
                                    onClick={() => handleCreateAPost()}
                                    className="flex shrink-0 flex-row text-lg font-bold items-center gap-1 bg-blue-50 shadow-md py-2 pl-2 pr-4 rounded-full hover:bg-blue-100"
                                >
                                    <PlusIcon className="w-4 h-4 my-auto stroke-2 stroke-black" />

                                    <p className="text-bold shrink-0 text-sm">
                                        Create a post
                                    </p>
                                </button>
                            </div>
                        )}
                        <div className=" mx-auto">
                            {createAPost && (
                                <div className="CLOSE_CREATEPOST flex justify-end">
                                    <button
                                        type="button"
                                        className="font-medium text-sm"
                                        onClick={() => handleCreateAPost()}
                                    >
                                        <XMarkIcon className="text-gray-600 w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {createAPost && (
                                <div>
                                    <h2 className="font-bold text-center text-md mb-1">
                                        Create your event
                                    </h2>
                                    <CreateAPost
                                        postAdded={postAdded}
                                        group={group}
                                    />
                                </div>
                            )}
                        </div>
                        {/* invite users */}
                        <div className="INVITE shrink-0 flex mt-2 mx-auto lg:mx-0">
                            <form
                                className="flex flex-col bg-white rounded-lg"
                                onSubmit={sendInvite}
                            >
                                <div className="flex p-2  gap-1 bg-blue-500 text-white rounded-t-lg">
                                    <PlusIcon className="w-4 h-4 my-auto stroke-2 stroke-white shrink-0" />
                                    <h2 className="font-bold text-center text-sm mb">
                                        Invite users
                                    </h2>
                                </div>

                                <div className="USER_POPUP  overflow-scroll shadow-md max-h-60">
                                    {userList.map((user: any) => {
                                        return (
                                            <div
                                                className="p-2 flex flex-row gap-1"
                                                key={`userGroupOption-${user.id}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="user"
                                                    value={user.id}
                                                    className="my-auto"
                                                />
                                                <label
                                                    htmlFor="user"
                                                    className="my-auto"
                                                >
                                                    {user.fName} {user.lName}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                                <input
                                    type="submit"
                                    value="Invite"
                                    className="text-white font-bold bg-blue-500 rounded-t-none"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
