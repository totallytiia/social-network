import { useState /*, useEffect*/ } from 'react';
import Comment from './Comment';

interface IComment {
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

interface ICommentsSectionProps {
    commentsInput: IComment[];
    post_id: number;
}

export default function CommentsSection({
    commentsInput,
    post_id,
}: ICommentsSectionProps) {
    const [comments, setComments] = useState(commentsInput);
    const [comment, setComment] = useState({
        post_id: 0,
        comment: '',
    } as IComment);

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        const data = await response.json();
        if (data.errors) {
            return;
        }
        (
            document.getElementById('commentBox' + post_id) as HTMLInputElement
        ).value = '';
        const commentsCopy = comments !== null ? Array.from(comments) : [];
        commentsCopy.push(data);
        setComments(commentsCopy);
    };

    async function deleteComment(id: number) {
        const url = `http://localhost:8080/api/comments/delete`;
        const FD = new FormData();
        FD.append('comment_id', id.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            console.log(data);
            return;
        }
        setComments(comments.filter((comment: any) => comment.id !== id));
    }

    return (
        <>
            <div className="ml-8 mr-8 my-2">
                {comments !== null
                    ? comments.map((comment: any) => (
                          <Comment
                              key={comment.id}
                              comment={comment}
                              deleteComment={deleteComment}
                          />
                      ))
                    : null}
                <form
                    onSubmit={(e) => handleCommentSubmit(e)}
                    className="flex flex-cols mt-1"
                >
                    <input
                        className="bg-gray-50 px-4 text-sm outline-none rounded-full w-full"
                        type="text"
                        id={'commentBox' + post_id}
                        placeholder="Write a comment"
                        onChange={(e) => {
                            setComment({
                                post_id: post_id,
                                comment: e.target.value,
                            } as IComment);
                        }}
                    />
                    <label
                        className="my-auto cursor-pointer"
                        htmlFor={'commentSubmit-' + post_id}
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
                        className="hidden"
                        type="submit"
                        id={`commentSubmit-${post_id}`}
                    />
                </form>
            </div>
        </>
    );
}
