import Post from './Post';
import GroupSelection from './GroupSelection';
import CreateAPost from '../CreateAPost/CreateAPost';

export default function Posts() {
    return (
        <div className="flex flex-col items-center bg-custom">
            <div className="flex flex-col mx-auto bg-white w-9/12 max-w-4xl m-6 rounded-xl shadow-lg">
                <CreateAPost />
                <GroupSelection />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </div>
        </div>
    );
}
