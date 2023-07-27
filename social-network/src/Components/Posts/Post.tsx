import CommentsSection from './CommentsSection';

interface PostProps {
    deletePost: (id: number) => void;
    post: {
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

export default function Post({ post, deletePost }: PostProps) {
    const handleDislike = async (e: any) => {
        if (post.liked == 0 || post.liked == 1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());
            FD.append('value', '-1');
            const res = await fetch('http://localhost:8080/api/likes/like', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                console.log('error like');
                return;
            } else {
                console.log('success like');
            }
            post.dislikes++;
            post.liked = -1;
            return;
        }
        if (post.liked == -1) {
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
            } else {
                console.log('success unlike');
            }
            post.dislikes--;
            post.liked = 0;
            return;
        }
    };

    const handleLike = async (e: any) => {
        if (post.liked == 0 || post.liked == -1) {
            const FD = new FormData();
            FD.append('post_id', post.id.toString());
            FD.append('value', '1');
            const res = await fetch('http://localhost:8080/api/likes/like', {
                method: 'POST',
                body: FD,
                credentials: 'include',
            });
            if (!res.ok) {
                console.log('error like');
                return;
            } else {
                console.log('success like');
            }
            post.likes++;
            post.liked = 1;
            return;
        }
        if (post.liked == 1) {
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
            } else {
                console.log('success unlike');
            }
            post.likes--;
            post.liked = 0;
            return;
        }
    };

    return (
        <div>
            <div className="mt-4 mx-6 mb-0 p-5 bg-blue-50 rounded-xl">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-black">
                            <img className="" src={post.user_avatar} alt="" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-sm font-bold">
                                {post.user_fname + ' ' + post.user_lname}
                            </h1>
                            <p className="text-xs">{post.created_at}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => deletePost(post.id)}
                        className="mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#e50000"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                </div>
                <div className="mt-2">
                    <p className="text-sm">{post.content}</p>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="flex gap-4">
                        <button
                            onClick={(e) => handleLike(e)}
                            className="flex gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-5 h-5 my-auto ${
                                    post.liked === 1 ? 'fill-green-500' : ''
                                }`}
                            >
                                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                            </svg>

                            <p>{post.likes}</p>
                        </button>
                        <button
                            onClick={(e) => handleDislike(e)}
                            className="flex gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-5 h-5 my-auto ${
                                    post.liked === -1 ? 'fill-red-500' : ''
                                }`}
                            >
                                <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                            </svg>
                            <p>{post.dislikes}</p>
                        </button>
                        <button className="flex gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 my-auto"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                />
                            </svg>
                            <p>
                                {post.comments !== null
                                    ? post.comments.length
                                    : 0}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
            <CommentsSection post_id={post.id} comments={post.comments} />
        </div>
    );
}
