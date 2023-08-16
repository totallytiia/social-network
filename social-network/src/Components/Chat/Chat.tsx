import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputBox from './ChatInputBox';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

export default function Chat() {
    const [chatVisible, setChatVisible] = useState(true);

    if (!chatVisible) {
        return (
            <div onClick={() => setChatVisible(!chatVisible)}>
                <ChatBubbleOvalLeftEllipsisIcon className='fill-white w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2'
                />
            </div>
        );
    }

    return (
        <div className="max-w-sm mx-auto mt-32 ">
            <div className="CLOSE_CHAT flex flex-row justify-end items-center py-2">
                <button
                    type="button"
                    className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
                    onClick={() => setChatVisible(!chatVisible)}
                >
                    <XMarkIcon className="text-gray-600 w-5 h-5" />
                </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow relative">
                <ChatHeader name={'name'} />
                <ChatContent
                //  messages={messages}
                />
                <ChatInputBox
                //sendANewMessage={sendANewMessage}
                />
            </div>
        </div>
    );
}
