import { useState, useEffect, useContext } from 'react';
import CreateEvent from './CreateEvent';
import { useParams } from 'react-router-dom';
import CreateAPost from '../CreateAPost/CreateAPost';
import Post from '../Posts/Post';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../App/App';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

interface iGroup {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    posts: any[];
    members: any[];
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
                console.log(data);
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

    if (
        !group.members
            ?.map((member) => parseInt(Object.keys(member)[0]))
            .includes(userData?.id)
    ) {
        return (
            <div className="bg-custom">
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
                                    <div
                                        className="flex flex-row gap-1 shrink-0"
                                        onClick={() => {
                                            setRequestSent(false);
                                        }}
                                    >
                                        <PlusCircleIcon className="w-6 h-6 shrink-0 my-auto" />
                                        <p>Requested</p>
                                    </div>
                                ) : (
                                    <div
                                        className="flex flex-row gap-1 shrink-0"
                                        onClick={() => {
                                            setRequestSent(true);
                                        }}
                                    >
                                        <PlusCircleIcon className="w-6 h-6 font-bold shrink-0 my-auto" />
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
        <div className="bg-custom">
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
                        <div className="grid grid-cols-2 mt-2 text-center ">
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
                    <div className="mt-12 flex flex-col justify-center">
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
                <div className="p-6 order-0 lg:order-1 flex justify-center">
                    <div className="flex flex-col shrink-0 gap-2 mt-2 md:mt-0 md:pb-0">
                        {!createEvent && (
                            <div className="CREATE-EVENT mt-2">
                                <button
                                    onClick={() => handleCreateEvent()}
                                    className="flex shrink-0 flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-1 pr-4 rounded-full hover:bg-blue-100"
                                >
                                    <PlusCircleIcon className="w-6 h-6 shrink-0" />
                                    <p className="text-bold text-sm shrink-0">
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
                                    className="flex shrink-0 flex-row text-lg font-bold items-center gap-1 bg-blue-50 py-2 pl-1 pr-4 rounded-full hover:bg-blue-100"
                                >
                                    <PlusCircleIcon className="w-6 h-6 shrink-0" />

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
                                <CreateAPost
                                    postAdded={postAdded}
                                    group={group}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
