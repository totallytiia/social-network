import React, { useState } from 'react';
import Comment from './Comment';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

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
        image: '',
    } as IComment);

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const FD = new FormData();

        FD.append('post_id', comment.post_id.toString() as string);
        FD.append('comment', comment.comment as string);
        FD.append('image', comment.image as string);

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
        (
            document.getElementById(
                'commentImgUpload' + post_id
            ) as HTMLInputElement
        ).value = '';

        setComment({
            post_id: 0,
            comment: '',
            image: '',
        } as IComment);

        document.getElementById('CheckIcon' + post_id)?.classList.add('hidden');
        document
            .getElementById('PlusIcon' + post_id)
            ?.classList.remove('hidden');
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
            return;
        }
        setComments(comments.filter((comment: any) => comment.id !== id));
    }

    const handleCommentImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files?.length === 0) return;
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const commentCopy = comment;
            commentCopy.image = reader.result as string;
            setComment(commentCopy);
        };
        reader.readAsDataURL(file as Blob);
        document.getElementById('PlusIcon' + post_id)?.classList.add('hidden');
        document
            .getElementById('CheckIcon' + post_id)
            ?.classList.remove('hidden');
    };

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
                    <label htmlFor={'commentImgUpload' + post_id}>
                        <PlusIcon
                            id={'PlusIcon' + post_id}
                            className="cursor-pointer stroke-2 w-8 h-8 mr-1 my-auto bg-blue-500 shrink-0 stroke-white rounded-full p-1"
                        />
                        <CheckIcon
                            id={'CheckIcon' + post_id}
                            className="hidden cursor-pointer stroke-2 w-8 h-8 mr-1 my-auto bg-green-500 shrink-0 stroke-white rounded-full p-1"
                        />
                    </label>
                    <input
                        onChange={(e) => {
                            handleCommentImageUpload(e);
                        }}
                        type="file"
                        id={'commentImgUpload' + post_id}
                        className="hidden"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                    />

                    <input
                        className="bg-gray-50 px-4 text-sm outline-none rounded-full w-full"
                        type="text"
                        id={'commentBox' + post_id}
                        placeholder="Write a comment"
                        onChange={(e) => {
                            const commentCopy = comment;
                            commentCopy.post_id = post_id;
                            commentCopy.comment = e.target.value;
                            setComment(commentCopy);
                        }}
                    />
                    <label
                        className="my-auto cursor-pointer"
                        htmlFor={'commentSubmit-' + post_id}
                    >
                        <PaperAirplaneIcon className="w-6 h-6 ml-1 my-auto stroke-1.5 stroke-gray-400" />
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
