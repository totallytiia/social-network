import ChatList from '../Chat/ChatList';
import { useEffect, useRef, useState, useContext } from 'react';
import { WSContext } from '../WSProvider/WSProvider';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

interface IMessage {
    id: number;
    sender: string;
    receiver: string;
    content: string;
    seen: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function Footer() {
    const { ws } = useContext(WSContext);
    const [messages, setMessages] = useState([] as IMessage[]);
    const [newMessage, setNewMessage] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const numUnseenMessages = useRef(0);

    useEffect(() => {
        async function getMessages() {
            const res = await fetch('http://localhost:8080/api/messages', {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                return;
            }
            const data = await res.json();
            if (data) {
                return;
            }
            setMessages(data);
            setNewMessage(true);
        }
        getMessages();
    }, [newMessage]);

    useEffect(() => {
        numUnseenMessages.current = messages.filter((m) => !m.seen).length;
    }, [messages]);

    return (
        <>
            <div id="notifications" className="fixed bottom-2 left-2"></div>
            <div id="chat" className="fixed bottom-2 right-2">
                {chatVisible ? (
                    <ChatList numUnseenMessages={numUnseenMessages.current} />
                ) : (
                    <button onClick={() => setChatVisible(true)}>
                        <ChatBubbleOvalLeftIcon className="fill-white w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2" />
                        {numUnseenMessages.current > 0 ? (
                            <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
                                {numUnseenMessages.current}
                            </div>
                        ) : null}
                    </button>
                )}
            </div>

            <footer className="footer"></footer>
        </>
    );
}
