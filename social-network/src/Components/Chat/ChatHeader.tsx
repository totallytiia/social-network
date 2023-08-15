import { PhoneIcon, CameraIcon } from "@heroicons/react/24/outline";
import Avatar from "./Avatar";

interface Props {
	name: string;
}

const ChatHeader = ({ name }: Props) => {
	return (
		<div className="border-b-2 border-b-gray-200 py-3 px-6 flex flex-row justify-between items-center">
			<div className="flex flex-row items-center space-x-1.5">
				<Avatar />
				<div className="flex flex-col">
					<p className="text-xs text-gray-600">{name}</p>
				</div>
			</div>
			<div className="space-x-1">
			</div>
		</div>
	);
};

export default ChatHeader;
