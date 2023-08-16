import Chat from '../Chat/Chat';
import { useEffect, useRef, useState, useContext } from 'react';
import { WSContext } from '../WSProvider/WSProvider';

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
            if (!data) {
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
            <div id="notifications" className="absolute bottom-2 right-2">
                {chatVisible ? (
                    <Chat />
                ) : (
                    <button onClick={() => setChatVisible(true)}>
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
