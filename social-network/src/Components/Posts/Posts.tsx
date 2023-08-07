import Post from './Post';
import GroupSelection from './GroupSelection';
import CreateAPost from '../CreateAPost/CreateAPost';
import { useEffect, useState } from 'react';
import GroupsSidebar from './GroupsSidebar';
import UsersSidebar from './UsersSidebar';

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
            if (data.errors) {
                setPosts([]);
            }
            setPosts(data);
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
        if (data.errors) {
            return;
        }
        setPosts(posts.filter((post: any) => post.id !== id));
    };

    const postAdded = async (post: any) => {
        const postsCopy = [...posts];
        postsCopy.unshift(post);
        setPosts(postsCopy);
    };

    return (
        <div className="bg-custom">
            <div className="flex flex-col lg:flex-row lg:px-12 lg:justify-center gap-4">
                <GroupsSidebar />
                <div className="order-3 lg:order-2 flex flex-col lg:mx-0 mx-auto bg-white w-9/12 max-w-4xl m-6 rounded-xl shadow-lg pb-4">
                    <div className="flex flex-col  pb-4">
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
                <UsersSidebar />
            </div>
        </div>
    );
}
