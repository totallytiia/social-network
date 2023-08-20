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
import { TrashIcon } from '@heroicons/react/24/outline';

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
        group_name: string;
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
        <div className="">
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
                                {post.group_id !== 0 ? (
                                    <span
                                        className="text-xs"
                                        onClick={() =>
                                            (window.location.href = `/group/${post.group_id}`)
                                        }
                                    >
                                        {` in ${post.group_name}`}
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
                            <TrashIcon className="w-4 h-4 stroke-red-600" />
                        </button>
                    ) : (
                        ''
                    )}
                </div>
                <div className="mt-2">
                    <p className="text-sm">{post.content}</p>
                </div>
                {post.image !== '' ? (
                    <div className="mt-2 bg-blue-100 rounded-xl shadow-md">
                        <img
                            src={post.image}
                            alt=""
                            className="max-h-[50rem] mx-auto"
                        />
                    </div>
                ) : null}

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
