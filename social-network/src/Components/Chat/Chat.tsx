import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputBox from './ChatInputBox';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Chat() {
    const [chatVisible, setChatVisible] = useState(true);

    if (!chatVisible) {
        return (
            <div onClick={() => setChatVisible(!chatVisible)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="white"
                    className="w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                </svg>
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
