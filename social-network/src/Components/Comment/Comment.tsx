import { useContext } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Profile/ProfileIcon';
import { TrashIcon } from '@heroicons/react/24/solid';

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
                <div
                    onClick={() =>
                        (window.location.href = `/user/${comment.user_id}`)
                    }
                    className="cursor-pointer mt-2 w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none"
                >
                    <img
                        className="border-none outline-none"
                        src={comment.user_avatar.toString()}
                        alt=""
                    />
                    <ProfileIcon classNames="w-8 h-8" />
                </div>
                <div className="flex flex-col text-sm bg-gray-50 my-1 p-2 rounded-lg ">
                    <div className="flex font-bold gap-2 justify-between">
                        <p
                            className="cursor-pointer"
                            onClick={() =>
                                (window.location.href = `/user/${comment.user_id}`)
                            }
                        >
                            {comment.user_fname + ' ' + comment.user_lname}
                        </p>
                        {comment.user_id === userData.id ? (
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="mb-4"
                            >
                                <TrashIcon className="w-4 h-4" />
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
