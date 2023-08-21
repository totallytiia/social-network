import { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import { UserContext } from '../App/App';
import {
    ChatBubbleOvalLeftIcon,
    UserPlusIcon,
    UserMinusIcon,
    ClockIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
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
    followers: IUser[];
    follows: IUser[];
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
    const [followersVisible, setFollowersVisible] = useState(false);
    const [followsVisible, setFollowsVisible] = useState(false);
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
        const users = await getUsers();
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
            followers: users.filter((u: IUser) =>
                data.followers.split(',').includes(u.id.toString())
            ) as IUser[],
            follows: users.filter((u: IUser) =>
                data.follows.split(',').includes(u.id.toString())
            ) as IUser[],
            followed: (data.followers as string)
                .split(',')
                .map(Number)
                .includes(userData.id),
            followReq: data.followReq,
        } as IUser;
        setUser(user);
        setPrivacy(user.private);
    }, [id, userData.id]);

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
        return data;
    }

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

    return (
        <>
            <div className="p-10 bg-custom min-h-screen z-0 item-center justify-center">
                <div className="p-10 shadow-xl flex flex-col items-center bg-white max-w-7xl rounded-xl mx-auto">
                    <div className="grid grid-cols-1 items-center justify-between md:grid-cols-3 ">
                        <div className="grid grid-cols-2 text-center order-last md:order-first mt-7 md:mt-0">
                            <div
                                onClick={() =>
                                    setFollowersVisible(!followersVisible)
                                }
                            >
                                {
                                    // TODO: Tiia style
                                    followersVisible ? (
                                        <ul>
                                            {user.followers !== undefined &&
                                            user.followers.length > 0 ? (
                                                user.followers.map(
                                                    (u: IUser) => (
                                                        <li
                                                            key={u.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <Link
                                                                to={`/user/${u.id}`}
                                                            >
                                                                <div className="flex items-center">
                                                                    <ProfileIcon
                                                                        avatar={
                                                                            u.avatar
                                                                        }
                                                                        classNames="w-10 h-10 rounded-full shrink-0"
                                                                    />
                                                                    <p className="ml-2">
                                                                        {
                                                                            u.nickname
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li className="text-center">
                                                    No followers
                                                </li>
                                            )}
                                        </ul>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-700 text-xl">
                                                {user.followers !== undefined
                                                    ? user.followers.length
                                                    : 0}
                                            </p>
                                            <p className="text-gray-400 pr-2">
                                                Followers
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                            <div
                                onClick={() =>
                                    setFollowsVisible(!followsVisible)
                                }
                            >
                                {
                                    // TODO: Tiia style
                                    followsVisible ? (
                                        <ul>
                                            {user.follows !== undefined &&
                                            user.follows.length > 0 ? (
                                                user.follows.map((u: IUser) => (
                                                    <li
                                                        key={u.id}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <Link
                                                            to={`/user/${u.id}`}
                                                        >
                                                            <div className="flex items-center">
                                                                <ProfileIcon
                                                                    avatar={
                                                                        u.avatar
                                                                    }
                                                                    classNames="w-10 h-10 rounded-full shrink-0"
                                                                />
                                                                <p className="ml-2">
                                                                    {u.nickname}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-center">
                                                    No follows
                                                </li>
                                            )}
                                        </ul>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-700 text-xl">
                                                {user.follows !== undefined
                                                    ? user.follows.length
                                                    : 0}
                                            </p>
                                            <p className="text-gray-400 pr-2">
                                                Follows
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <div className="relative w-48 mx-auto">
                            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl shrink-0 flex items-center justify-center">
                                {user.avatar !== undefined &&
                                user.avatar.toString() !== '' ? (
                                    <img
                                        className="border-none rounded-full w-48 h-48 object-cover outline-none "
                                        src={user.avatar.toString()}
                                        alt=""
                                    />
                                ) : (
                                    <ProfileIcon classNames="w-48 h-48 rounded-full shrink-0" />
                                )}
                            </div>
                        </div>

                        <div className="justify-center gap-6 flex mt-10 md:mt-0 border-b md:border-b-0 pb-8 md:pb-0">
                            <div className="flex flex-col md:ml-4">
                                <p className="font-bold text-gray-700 text-xl mx-auto">
                                    {posts.length}
                                </p>
                                <p className="text-gray-400">Posts</p>
                            </div>
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
                                        checked={!!privacy}
                                        onChange={() => {}}
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
                        </div>
                    </div>

                    <div className="mt-10 text-center border-b pb-12">
                        <h1 className="text-4xl font-medium text-gray-700">
                            {`${user.fName} "${user.nickname}" ${user.lName}`}
                            <span className="text-gray-500"></span>
                        </h1>
                        {user.followers !== undefined ? (
                            user.id === userData.id ||
                            user.followers
                                .map((user) => user.id)
                                .includes(userData.id) ? (
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
                            ) : null
                        ) : null}
                    </div>

                    <div className="mt-6 w-2/3 min-w-min max-w-xl">
                        {posts !== undefined && posts.length !== 0 ? (
                            posts.map((post: any) => (
                                <div className="" key={`userPost-${post.id}`}>
                                    <div className="mt-4 mx-6 mb-0 p-5 bg-blue-50 rounded-xl">
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                <div className="h-8 w-8 relative overflow-hidden shrink-0 rounded-full bg-pink-200">
                                                    <ProfileIcon
                                                        avatar={
                                                            post.user_avatar
                                                        }
                                                        classNames="h-10 w-10"
                                                    />
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
                                                    <HandThumbUpIcon
                                                        className={`w-5 h-5 my-auto ${
                                                            post.liked === 1
                                                                ? 'fill-green-500'
                                                                : ''
                                                        }`}
                                                    />

                                                    <p>{post.likes}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <HandThumbDownIcon
                                                        className={`w-5 h-5 my-auto ${
                                                            post.liked === -1
                                                                ? 'fill-red-600'
                                                                : ''
                                                        }`}
                                                    />
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
