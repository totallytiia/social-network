import Post from './Post';
import GroupSelection from './GroupSelection';
import CreateAPost from '../CreateAPost/CreateAPost';
import { useEffect, useState } from 'react';

export default function Posts() {
    const [posts, setPosts] = useState<any[]>([]);
    useEffect(() => {
        async function getPosts() {
            const url = 'http://localhost:8080/api/posts/get?group_id=33';
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (!data.errors) {
                console.log(data);
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
    }

    const postAdded = (post: any) => {
        setPosts([post, ...posts]);
    }

    return (
        <div className="flex flex-col items-center bg-custom">
            <div className="flex flex-col mx-auto bg-white w-9/12 max-w-4xl m-6 rounded-xl shadow-lg pb-4">
                <CreateAPost postAdded={postAdded} />
                <GroupSelection />
                {posts.length !== 0 ? (
                    posts.map((post: any) => <Post deletePost={deletePost} key={post.id} post={post} />)
                ) : (
                    <p className="text-center text-2xl">No posts to show</p>
                )}
            </div>
        </div>
    );
}
