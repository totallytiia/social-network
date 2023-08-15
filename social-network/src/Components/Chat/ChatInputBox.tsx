import { useState } from "react";

const ChatInputBox = () => {


	const [newMessage, setNewMessage] = useState("");

	return (
		<div className="px-6 py-3 bg-white w-100 overflow-hidden rounded-bl-xl rounded-br-xla">
			<div className="flex flex-row items-center space-x-5">
				<input
					type="text"
					className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-200 rounded-lg outline-none focus:ring-blue-300"
					placeholder="Type your message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
				/>
				<button
					type="button"
					className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 outline-none disabled:opacity-50"
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatInputBox;