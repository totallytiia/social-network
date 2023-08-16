import CommentsSection from '../Comment/CommentsSection';
import { useState, useContext } from 'react';
import { UserContext } from '../App/App';
import ErrorNotification from '../Notification/ErrorNotification';
import { render } from '@testing-library/react';
import ProfileIcon from '../Profile/ProfileIcon';
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/solid';

interface PostProps {
    deletePost: (id: number) => void;
    postInput: {
        id: number;
        user_id: number;
        user_fname: string;
        user_lname: string;
        user_nickname: string;
        user_avatar: string;
        group_id: number;
        content: string;
        image: string;
        privacy: string;
        privacy_settings: string;
        created_at: string;
        updated_at: string;
        comments: any[];
        likes: number;
        dislikes: number;
        liked: number; // either 1 for like -1 dislike and 0 for no reaction
    };
}

export default function Post({ postInput, deletePost }: PostProps) {
    const { userData } = useContext(UserContext);
    const [post, setPost] = useState(postInput);

    const handleDislike = async (e: any) => {
        if (post.liked === 0 || post.liked === 1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());
            FD.append('value', '-1');
            const res = await fetch('http://localhost:8080/api/likes/like', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                render(
                    <ErrorNotification
                        title="Error: narcissism"
                        message="Sorry you can’t be this narcisistic that you want to react your own post"
                    />
                );
                return;
            }
            const postCopy = Object.assign({}, post);
            postCopy.liked === 0
                ? postCopy.dislikes++
                : postCopy.likes-- && postCopy.dislikes++;
            postCopy.liked = -1;
            setPost(postCopy);
            return;
        }
        if (post.liked === -1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());

            const res = await fetch('http://localhost:8080/api/likes/unlike', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                console.log('error unlike');
                return;
            }
            const postCopy = Object.assign({}, post);
            postCopy.dislikes--;
            postCopy.liked = 0;
            setPost(postCopy);
            return;
        }
    };

    const handleLike = async (e: any) => {
        if (post.liked === 0 || post.liked === -1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());
            FD.append('value', '1');
            const res = await fetch('http://localhost:8080/api/likes/like', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                render(
                    <ErrorNotification
                        title="Error: narcissism"
                        message="Sorry you can’t be this narcisistic that you want to like your own post"
                    />
                );
                return;
            }
            const postCopy = Object.assign({}, post);
            postCopy.liked === 0
                ? postCopy.likes++
                : postCopy.dislikes-- && postCopy.likes++;
            postCopy.liked = 1;
            setPost(postCopy);
            return;
        }
        if (post.liked === 1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());
            const res = await fetch('http://localhost:8080/api/likes/unlike', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                console.log('error unlike');
                return;
            }
            const postCopy = Object.assign({}, post);
            postCopy.likes--;
            postCopy.liked = 0;
            setPost(postCopy);
            return;
        }
    };

    return (
        <div>
            <div className="mt-4 mx-6 mb-0 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between">
                    <div className="flex">
                        <div
                            onClick={() =>
                                (window.location.href = `/user/${post.user_id}`)
                            }
                            className="cursor-pointer h-8 w-8 relative overflow-hidden rounded-full bg-pink-200"
                        >
                            <img
                                className="border-none outline-none"
                                src={post.user_avatar}
                                alt=""
                            />
                            <ProfileIcon classNames="w-10 h-10" />
                        </div>
                        <div className="ml-2">
                            <h1
                                onClick={(e) =>
                                    e.target === e.currentTarget &&
                                    (window.location.href = `/user/${post.user_id}`)
                                }
                                className="cursor-pointer text-sm font-bold"
                            >
                                {`${post.user_fname} ${post.user_lname}`}
                                {post.group_id !== null ? (
                                    <span
                                        className="text-xs"
                                        onClick={() =>
                                            (window.location.href = `/group/${post.group_id}`)
                                        }
                                    >
                                        {` in group ${post.group_id}`}
                                    </span>
                                ) : null}
                            </h1>
                            <p className="text-xs">
                                {new Date(post.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {post.user_id === userData.id ? (
                        <button
                            onClick={(e) => deletePost(post.id)}
                            className="mb-6"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="#e50000"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </button>
                    ) : (
                        ''
                    )}
                </div>
                <div className="mt-2">
                    <p className="text-sm">{post.content}</p>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="flex gap-4">
                        <button
                            onClick={(e) => handleLike(e)}
                            className="flex gap-1"
                        >
                            <HandThumbUpIcon
                                className={`w-5 h-5 my-auto ${
                                    post.liked === 1 ? 'fill-green-500' : ''
                                }`}
                            />

                            <p>{post.likes}</p>
                        </button>
                        <button
                            onClick={(e) => handleDislike(e)}
                            className="flex gap-1"
                        >
                            <HandThumbDownIcon
                                className={`w-5 h-5 my-auto ${
                                    post.liked === -1 ? 'fill-red-600' : ''
                                }`}
                            />
                            <p>{post.dislikes}</p>
                        </button>
                        <button className="flex gap-1">
                            <ChatBubbleOvalLeftIcon className="w-5 h-5 my-auto" />
                            <p>
                                {post.comments !== null
                                    ? post.comments.length
                                    : 0}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
            <CommentsSection
                key={post.id}
                post_id={post.id}
                commentsInput={post.comments}
            />
        </div>
    );
}
