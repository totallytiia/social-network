import { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

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
        <div className="px-6 py-3 bg-white w-100 overflow-hidden rounded-bl-xl rounded-br-xla">
            <div className="flex flex-row items-center space-x-5">
                <input
                    type="text"
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-200 rounded-lg outline-none focus:ring-blue-300"
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
                <label htmlFor={`chatImageUpload-${receiver.id}`}>
                    <DocumentIcon className="w-4 h-4 rounded-full" />
                </label>
                <input
                    type="file"
                    className="hidden"
                    id={`chatImageUpload-${receiver.id}`}
                    name={`chatImageUpload-${receiver.id}`}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFormImageChange}
                />
                <button
                    type="button"
                    className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 outline-none disabled:opacity-50"
                    disabled={newMessage === ''}
                    onClick={(e) => {
                        sendMessage(newMessage, image);
                        setNewMessage('');
                        setImage(null);
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatInputBox;
