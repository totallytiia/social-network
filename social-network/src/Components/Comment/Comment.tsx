import { useContext } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Profile/ProfileIcon';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
    image: string;
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
                <Link
                    to={`/user/${comment.user_id}`}
                    className="cursor-pointer mt-2 w-6 h-6 relative overflow-hidden shrink-0 rounded-full bg-pink-200 border-none outline-none"
                >
                    <img
                        className="border-none outline-none"
                        src={comment.user_avatar.toString()}
                        alt=""
                    />
                    <ProfileIcon classNames="w-8 h-8" />
                </Link>
                <div className="flex flex-col text-sm bg-gray-50 my-1 p-2 rounded-lg ">
                    <div className="flex font-bold gap-2 justify-between">
                        <Link
                            className="cursor-pointer"
                            to={`/user/${comment.user_id}`}
                        >
                            {comment.user_fname + ' ' + comment.user_lname}
                        </Link>
                        {comment.user_id === userData.id ? (
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="mb-4"
                            >
                                <TrashIcon className="w-4 h-4 stroke-red-600" />
                            </button>
                        ) : null}
                    </div>
                    <div className="flex">
                        <p>{comment.comment}</p>
                    </div>
                    <div>
                        {comment.image !== '' ? (
                            <img
                                src={comment.image}
                                alt=""
                                className="max-h-[20rem]"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    ) : null;
}
