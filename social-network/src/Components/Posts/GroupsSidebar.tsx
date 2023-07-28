import Group from './Group';

export default function GroupsSidebar() {
    return (
        <>
            <div className="lg:fixed lg:left-4 order-1">
                <div className="m-6 bg-blue-50 [&>*]:m-4 rounded-xl">
                    <h1 className="text-xl font-bold text-black">GROUPS</h1>
                    <Group />
                </div>
            </div>
        </>
    );
}
