import { useState } from 'react';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import Chat from './Chat';

export default function ChatList() {
    const [chatVisible, setChatVisible] = useState(true);

    if (!chatVisible) {
        return (
            <div onClick={() => setChatVisible(!chatVisible)}>
                <ChatBubbleOvalLeftIcon className="h-8 w-8 text-gray-500" />
            </div>
        );
    }

    return (
        <>
            <Chat setChatVisible={setChatVisible} />
        </>
    );
}
