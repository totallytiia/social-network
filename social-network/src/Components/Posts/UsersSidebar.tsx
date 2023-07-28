import User from './User';

export default function UsersSidebar() {
    return (
        <>
            <div className="order-2 lg:mx-0 mx-auto w-9/12 lg:max-w-xs">
                <div className="bg-blue-50 p-1 rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">Users</h1>
                    <User />
                </div>
            </div>
        </>
    );
}
