import { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface Props {
    sendMessage: (message: string, image: Blob | null) => void;
    receiver: {
        id: number;
    };
}

const ChatInputBox = ({ sendMessage, receiver }: Props) => {
    const [newMessage, setNewMessage] = useState('');
    const [image, setImage] = useState<Blob | null>(null);

    function handleFormInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewMessage(e.target.value);
    }
    const handleFormImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return;
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(file as Blob);
        };
        reader.readAsDataURL(file as Blob);
    };
    return (
        <div className=" shadow-[0px_-2px_4px_0px_#EDF2F7] bg-white w-100 rounded-b-xl w-64">
            <div className="flex flex-row items-center">
                <input
                    type="text"
                    className="flex-1 text-xs font-medium text-gray-700  rounded-lg outline-none"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={handleFormInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage(newMessage, image);
                            setNewMessage('');
                            setImage(null);
                        }
                    }}
                />
                {/* <label htmlFor={`chatImageUpload-${receiver.id}`}>
                    <DocumentIcon className="w-4 h-4 rounded-full" />
                </label>
                <input
                    type="file"
                    className="hidden"
                    id={`chatImageUpload-${receiver.id}`}
                    name={`chatImageUpload-${receiver.id}`}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFormImageChange}
                /> */}
                <button
                    type="button"
                    className="px-3 py-2 text-xs font-medium text-center text-gray-600 rounded-lg hover:bg-blue-800 outline-none disabled:opacity-50"
                    disabled={newMessage === ''}
                    onClick={(e) => {
                        sendMessage(newMessage, image);
                        setNewMessage('');
                        setImage(null);
                    }}
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInputBox;
