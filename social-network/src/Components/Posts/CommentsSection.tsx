import { useState, useEffect } from 'react';
import Comment from './Comment';

interface IComments {
    id: number;
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_nickname: string;
    user_avatar: Blob;
    post_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export default function CommentsSection(props: any) {
    // fetch comments data from backend
    const [commentsData, setCommentsData] = useState({
        comments: [] as IComments[],
    });

    const [comment, setComment] = useState({
        post_id: 0,
        comment: '',
    });

    useEffect(() => {
        const fetchCommentsData = async () => {
            const url = `http://localhost:8080/api/comments/getall?post_id=${props.post_id}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) return;
            const data = await res.json();
            if (!data.errors) {
                console.log(data);
            }
            setCommentsData(data);
        };
        console.log(commentsData);
        fetchCommentsData();
    }, []);

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(comment);
        const FD = new FormData();

        FD.append('post_id', comment.post_id.toString() as string);
        FD.append('comment', comment.comment as string);

        const response = await fetch(
            'http://localhost:8080/api/comments/create',
            {
                method: 'POST',
                credentials: 'include',
                body: FD,
            }
        );

        (document.getElementById('commentBox') as HTMLInputElement).value = '';

        if (response.status === 201) {
            console.log('Comment created!');
            // Send await response.json() to the parent
            const comment = await response.json();
        } else {
            console.log('Error creating comment!');
            console.log(response);
        }
    };

    return (
        <>
            <div className="ml-8 mr-6 my-2">
                <form
                    onSubmit={(e) => handleCommentSubmit(e)}
                    className="flex flex-cols"
                    action=""
                >
                    <input
                        className="bg-gray-50 px-4 text-sm outline-none rounded-full w-full"
                        type="text"
                        id="commentBox"
                        placeholder="Write a comment"
                        onChange={(e) => {
                            setComment({
                                post_id: props.post_id,
                                comment: e.target.value,
                            });
                        }}
                    />
                    <label
                        className="my-auto cursor-pointer"
                        htmlFor="commentSubmit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="gray"
                            className="w-5 h-5 ml-1 my-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                        </svg>
                    </label>
                    <input
                        id="commentSubmit"
                        className="hidden"
                        type="submit"
                    />
                </form>
                {/* get all comments  */}
                {/* {commentsData.comments.map((comment: any) => (
					<Comment comment={comment} />
				))} */}
            </div>
        </>
    );
}
