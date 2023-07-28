import User from './User';

export default function UsersSidebar() {
    return (
        <>
            <div className="lg:fixed lg:right-4 right order-2">
                <div className="m-6 bg-blue-50 [&>*]:m-4 rounded-xl">
                    <h1 className="font-bold text-xl text-black">PEEPS</h1>
                    <User />
                </div>
            </div>
        </>
    );
}
