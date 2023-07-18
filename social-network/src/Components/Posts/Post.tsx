interface PostProps {
    deletePost: (id: number) => void;
    post: {
        id: number;
        user_id: number;
        group_id: number;
        title: string;
        content: string;
        image: string;
        privacy: string;
        privacy_settings: string;
        created_at: string;
        updated_at: string;
        comments: any[];
    };
}



export default function Post({ post, deletePost }: PostProps) {
    return (
        <div className="mt-4 mx-6 mb-0 p-6 bg-blue-50 rounded-xl">
            <div className="flex justify-between">
                <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-black"></div>
                    <div className="ml-2">
                        <h1 className="text-sm font-bold">{post.user_id}</h1>
                        <p className="text-xs">{post.created_at}</p>
                    </div>
                </div>
                <button onClick={(e) => deletePost(post.id)} className="">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e50000" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>

                </button>
            </div>
            <div className="mt-2">
                <p className="text-sm">{post.content}</p>
            </div>
        </div>
    );
}
