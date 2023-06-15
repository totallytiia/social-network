export default function GroupSelection(props: any) {
    return (
        <div className="flex space-x-2 text-xs mt-4 mb-0">
            <button className="text-black hover:bg-blue-200 focus:bg-blue-200 bg-blue-100 py-2 px-3 rounded-full">
                All
            </button>
            <button className="text-black hover:bg-blue-200 focus:bg-blue-200 bg-blue-100 py-2 px-3 rounded-full">
                Friends
            </button>
            <button className="text-black hover:bg-blue-200 focus:bg-blue-200 bg-blue-100 py-2 px-3 rounded-full">
                Personal
            </button>
        </div>
    );
}
