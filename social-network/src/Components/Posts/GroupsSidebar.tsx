import Group from '../Group/Group';

export default function GroupsSidebar() {
    return (
        <>
            <div className="order-1 lg:mx-0 mx-auto w-9/12 lg:max-w-xs">
                <div className="bg-blue-50 rounded-xl mt-6 p-4">
                    <h1 className="font-bold text-xl text-black mb-2">
                        GROUPS
                    </h1>
                    <Group />
                </div>
            </div>
        </>
    );
}
