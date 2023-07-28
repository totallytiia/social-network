import User from './User';

export default function UsersSidebar() {
    return (
        <>
            <div className="order-2">
                <div className="m-6 bg-blue-50 [&>*]:m-2 p-1 rounded-xl">
                    <h1 className="font-bold text-xl text-black">Users</h1>
                    <User />
                </div>
            </div>
        </>
    );
}
