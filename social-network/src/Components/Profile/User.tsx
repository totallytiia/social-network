import { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import { UserContext } from '../App/App';
import {
    ChatBubbleOvalLeftIcon,
    UserPlusIcon,
    UserMinusIcon,
    ClockIcon,
} from '@heroicons/react/24/solid';

interface IUser {
    id: number;
    fName: string;
    nickname: string;
    lName: string;
    avatar: Blob;
    about: string;
    email: string;
    dateOfBirth: string;
    private: boolean;
    followed: boolean;
    followers: number[];
    follows: number[];
    followReq?: boolean;
}

interface IPost {
    id: number;
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_nickname: string;
    user_avatar: Blob;
    group_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    comments: number;
}

export default function User() {
    const [user, setUser] = useState({} as IUser);
    const [posts, setPosts] = useState([] as IPost[]);
    const [privacy, setPrivacy] = useState(user.private);
    const { id } = useParams();
    const { userData } = useContext(UserContext);
    const getUser = useCallback(async () => {
        const url = `http://localhost:8080/api/users/get?id=${id}`;
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        if (!res.ok) {
            setUser({} as IUser);
            return;
        }
        const data = await res.json();
        const user = {
            id: data.id,
            fName: data.fName,
            nickname: data.nickname,
            lName: data.lName,
            avatar: data.avatar,
            about: data.aboutMe,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            private: data.private,
            followers: (data.followers as string)
                .split(',')
                .map(Number)
                .filter((id) => id !== 0),
            follows: (data.follows as string)
                .split(',')
                .map(Number)
                .filter((id) => id !== 0),
            followed: (data.followers as string)
                .split(',')
                .map(Number)
                .includes(userData.id),
            followReq: data.followReq,
        } as IUser;
        setUser(user);
        setPrivacy(user.private);
    }, [id, userData.id]);

    useEffect(() => {
        async function getPosts() {
            if (id === undefined) return;
            const url = `http://localhost:8080/api/posts/get?user_id=${id}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) return; // no posts
            const data = await res.json();
            if (data.errors) {
                setPosts([] as IPost[]);
            }
            setPosts(data);
        }
        if (id) {
            getUser();
            getPosts();
        }
    }, [id, getUser]);

    const handlePrivate = async () => {
        const url = `http://localhost:8080/api/users/private`;
        const FD = new FormData();
        FD.append('private', (!privacy).toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setPrivacy(!privacy);
    };

    useEffect(() => {
        getUser();
    }, [user.followed, getUser]);

    async function followUser() {
        if (id === undefined) return;
        const url = `http://localhost:8080/api/users/follow`;
        const FD = new FormData();
        FD.append('id', id);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setUser({ ...user, followed: true });
    }

    async function unfollowUser() {
        if (id === undefined) return;
        const url = `http://localhost:8080/api/users/unfollow`;
        const FD = new FormData();
        FD.append('id', id);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        setUser({ ...user, followed: false });
    }

    console.log(user.followReq);

    return (
        <>
            <div className="p-10 bg-custom z-0 item-center justify-center">
                <div className="p-10 shadow-xl flex flex-col items-center bg-white max-w-7xl rounded-xl mx-auto">
                    <div className="grid grid-cols-1 items-center justify-between md:grid-cols-3 ">
                        <div className="grid grid-cols-3 text-center order-last md:order-first mt-7 md:mt-0">
                            <div>
                                <p className="font-bold text-gray-700 text-xl">
                                    {user.followers !== undefined
                                        ? user.followers.length
                                        : 0}
                                </p>
                                <p className="text-gray-400 pr-2">Followers</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 text-xl">
                                    {user.follows !== undefined
                                        ? user.follows.length
                                        : 0}
                                </p>
                                <p className="text-gray-400">Following</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 text-xl">
                                    {posts.length}
                                </p>
                                <p className="text-gray-400">Posts</p>
                            </div>
                        </div>
                        <div className="relative w-48 mx-auto">
                            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl flex items-center justify-center text-indigo-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-24 w-24"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="justify-center gap-6 flex mt-10 md:mt-0 border-b md:border-b-0 pb-8 md:pb-0">
                            <label className="my-auto relative items-center cursor-pointer">
                                <div
                                    className={`flex flex-row ${
                                        user.id !== userData.id ? 'hidden' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="sr-only peer"
                                        checked={privacy}
                                    ></input>
                                    <div
                                        onClick={() => {
                                            handlePrivate();
                                        }}
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"
                                    ></div>
                                    <span className="my-auto ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Private
                                    </span>
                                </div>
                            </label>
                            <button
                                className={`FOLLOW ${
                                    user.id === userData.id ? 'hidden' : ''
                                }`}
                                onClick={
                                    user.followReq
                                        ? undefined
                                        : user.followed
                                        ? unfollowUser
                                        : followUser
                                }
                            >
                                {user.followed ? (
                                    <UserMinusIcon className="w-10 h-10 bg-blue-100 rounded-full p-2" />
                                ) : user.followReq ? (
                                    <ClockIcon className="w-10 h-10 bg-blue-100 rounded-full p-2" />
                                ) : (
                                    <UserPlusIcon className="w-10 h-10 bg-blue-100 rounded-full p-2" />
                                )}
                            </button>

                            <button
                                className={`CHAT ${
                                    user.id === userData.id ? 'hidden' : ''
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-10 h-10 bg-blue-100 rounded-full p-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 text-center border-b pb-12">
                        <h1 className="text-4xl font-medium text-gray-700">
                            {`${user.fName} "${user.nickname}" ${user.lName}`}
                            <span className="text-gray-500"></span>
                        </h1>
                        {!user.private ? (
                            <>
                                <p className="text-gray-600 mt-3">
                                    {user.about}
                                </p>
                                <p className="mt-8 text-gray-500">
                                    {user.email}
                                </p>
                                <p className="mt-2 text-gray-500">
                                    {user.dateOfBirth}
                                </p>
                            </>
                        ) : null}
                    </div>

                    <div className="mt-6 w-2/3 min-w-min max-w-xl">
                        {posts !== undefined && posts.length !== 0 ? (
                            posts.map((post: any) => (
                                <div className="" key={`userPost-${post.id}`}>
                                    <div className="mt-4 mx-6 mb-0 p-5 bg-blue-50 rounded-xl">
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                <div className="h-8 w-8 relative overflow-hidden rounded-full bg-pink-200">
                                                    <img
                                                        className="border-none outline-none"
                                                        src={post.user_avatar}
                                                        alt=""
                                                    />
                                                    <ProfileIcon classNames="w-10 h-10" />
                                                </div>
                                                <div className="ml-2">
                                                    <h1 className="text-sm font-bold">
                                                        {post.user_fname +
                                                            ' ' +
                                                            post.user_lname}
                                                    </h1>
                                                    <p className="text-xs">
                                                        {new Date(
                                                            post.created_at
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm">
                                                {post.content}
                                            </p>
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <div className="flex gap-4">
                                                <div className="flex gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className={`w-5 h-5 my-auto ${
                                                            post.liked === 1
                                                                ? 'fill-green-500'
                                                                : ''
                                                        }`}
                                                    >
                                                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                                    </svg>

                                                    <p>{post.likes}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className={`w-5 h-5 my-auto ${
                                                            post.liked === -1
                                                                ? 'fill-red-600'
                                                                : ''
                                                        }`}
                                                    >
                                                        <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                                                    </svg>
                                                    <p>{post.dislikes}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <ChatBubbleOvalLeftIcon className="w-5 h-5 my-auto" />
                                                    <p>
                                                        {post.comments !== null
                                                            ? post.comments
                                                                  .length
                                                            : 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-2xl">
                                No posts to show
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
