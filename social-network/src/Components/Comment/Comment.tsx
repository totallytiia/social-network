import { useContext } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Profile/ProfileIcon';

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
interface ICommentProps {
    comment: IComment;
    deleteComment: (id: number) => void;
}

export default function Comment({ comment, deleteComment }: ICommentProps) {
    const { userData } = useContext(UserContext);
    return comment !== undefined ? (
        <>
            <div className="flex flex-row gap-2">
                <div className="w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none">
                    <img
                        className="border-none outline-none"
                        src={comment.user_avatar.toString()}
                        alt=""
                    />
                    <ProfileIcon classNames="w-8 h-8" />
                </div>
                <div className="flex flex-col text-sm bg-gray-50 my-1 p-2 rounded-lg ">
                    <div className="flex font-bold gap-2 justify-between">
                        <p>{comment.user_fname + ' ' + comment.user_lname}</p>
                        {comment.user_id === userData.id ? (
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="mb-4"
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
                        ) : null}
                    </div>
                    <div className="flex">
                        <p>{comment.comment}</p>
                    </div>
                </div>
            </div>
        </>
    ) : null;
}
