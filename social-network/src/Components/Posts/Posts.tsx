import Post from './Post';
import GroupSelection from './GroupSelection';
import CreateAPost from '../CreateAPost/CreateAPost';
import { useEffect, useState } from 'react';

interface IPost {
    id: number;
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_nickname: string;
    user_avatar: Blob;
    group_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    comments: number;
}

export default function Posts() {
    const [posts, setPosts] = useState([] as IPost[]);
    useEffect(() => {
        async function getPosts() {
            const url = 'http://localhost:8080/api/posts/get';
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) return; // no posts
            const data = await res.json();
            if (!data.errors) {
                console.log(data);
                setPosts([]);
            }
            setPosts(data.posts);
        }
        getPosts();
    }, []);

    const deletePost = async (id: number) => {
        const url = `http://localhost:8080/api/posts/delete`;
        const FD = new FormData();
        FD.append('post_id', id.toString());
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (!data.errors) {
            console.log(data);
        }
        setPosts(posts.filter((post: any) => post.id !== id));
    };

    const postAdded = (post: any) => {
        var postsCopy = posts;
        postsCopy !== undefined
            ? postsCopy.unshift(post)
            : (postsCopy = [post]);
        setPosts(postsCopy);
    };

    return (
        <div className="bg-custom">
            <div className="flex flex-col lg:flex-row lg:px-12">
                <div className="lg:fixed lg:left-4 order-1">
                    <div className="m-6 bg-blue-50 [&>*]:m-4 rounded-xl">
                        <h1 className="text-xl font-bold text-black">GROUPS</h1>
                    </div>
                </div>
                <div className="order-3 lg:order-2 flex flex-col mx-auto bg-white w-9/12 max-w-4xl m-6 rounded-xl shadow-lg pb-4">
                    <div className="flex flex-col  shadow-lg pb-4">
                        <CreateAPost postAdded={postAdded} />
                        <GroupSelection />
                        {posts !== undefined && posts.length !== 0 ? (
                            posts.map((post: any) => (
                                <Post
                                    deletePost={deletePost}
                                    key={post.id}
                                    postInput={post}
                                />
                            ))
                        ) : (
                            <p className="text-center text-2xl">
                                No posts to show
                            </p>
                        )}
                    </div>
                </div>
                <div className="lg:fixed lg:right-4 right order-2">
                    <div className="m-6 bg-blue-50 [&>*]:m-4 rounded-xl">
                        <h1 className="font-bold text-xl text-black">PEEPS</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
