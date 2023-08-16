import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputBox from './ChatInputBox';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

interface Props {
    setChatVisible: (value: boolean) => void;
}

interface Message {
    id: number;
    content: string;
    image: Blob;
    sender: number;
    receiver: number;
    timestamp: Date;
}

export default function Chat(props: Props) {
    const { setChatVisible } = props;
    const [messages, setMessages] = useState([] as Message[]);

    async function sendMessage() {}

    return (
        <div className="max-w-sm mx-auto mt-32 ">
            <div className="bg-white border border-gray-200 rounded-lg shadow relative">
                <ChatHeader props={{ name: 'name' }}>
                    <div className="CLOSE_CHAT flex flex-row justify-end items-center py-2">
                        <button
                            type="button"
                            className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
                            onClick={() => setChatVisible(false)}
                        >
                            <XMarkIcon className="text-gray-600 w-5 h-5" />
                        </button>
                    </div>
                </ChatHeader>
                <ChatContent messages={messages} />
                <ChatInputBox
                //sendANewMessage={sendANewMessage}
                />
            </div>
        </div>
    );
}
