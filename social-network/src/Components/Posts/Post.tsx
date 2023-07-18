interface PostProps {
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

export default function Post({ post }: PostProps) {
    return (
        <div className="mt-4 mx-6 mb-0 p-6 bg-blue-50 rounded-xl">
            <div className="flex">
                <div className="h-10 w-10 rounded-full bg-black"></div>
                <div className="ml-2">
                    <h1 className="text-sm font-bold">{post.user_id}</h1>
                    <p className="text-xs">{post.created_at}</p>
                </div>
            </div>
            <div className="mt-2">
                <p className="text-sm">{post.content}</p>
            </div>
        </div>
    );
}
