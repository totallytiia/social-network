import Post from './Post';
import GroupSelection from './GroupSelection';

export default function Posts() {
    return (
        <div className="flex flex-col items-center bg-gradient-to-t from-white from-95%  to-orange-100 to-100%">
            <div className="flex flex-col items-center bg-white w-9/12 max-w-4xl m-6 rounded-xl shadow-lg">
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
