import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputBox from './ChatInputBox';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface Props {
    setVisibleChats: React.Dispatch<
        React.SetStateAction<{ groups: number[]; users: number[] }>
    >;
    visibleChats: { groups: number[]; users: number[] };
    type: 'group' | 'receiver';
    id: number;
    ws: WebSocket;
}

interface Message {
    id: number;
    content: string;
    image: Blob;
    sender: number;
    receiver: number;
    timestamp: Date;
}

export default function Chat({
    setVisibleChats,
    visibleChats,
    type,
    id,
    ws,
}: Props) {
    const [messages, setMessages] = useState([] as Message[]);

    useEffect(() => {
        async function getChat() {
            const url = `http://localhost:8080/api/chat/get?${type}_id=${id}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) {
                setMessages([] as Message[]);
                return;
            }
            const data = await res.json();
            if (data.errors) {
                return;
            }
            var messages: Message[] = [];
            for (const message of data) {
                messages.push({
                    id: message.id,
                    content: message.message,
                    image: message.image,
                    sender: message.user_id,
                    receiver: message.receiver_id,
                    timestamp: message.sent_at,
                });
            }
            setMessages(messages);
        }
        getChat();
    }, [id, type]);

    async function sendMessage() {}

    return (
        <div className="max-w-sm mx-auto mt-32 ">
            <div className="bg-white border border-gray-200 rounded-lg shadow relative">
                <ChatHeader props={{ name: 'name' }}>
                    <div className="CLOSE_CHAT flex flex-row justify-end items-center py-2">
                        <button
                            type="button"
                            className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
                            onClick={() => {
                                if (type === 'group') {
                                    setVisibleChats({
                                        ...visibleChats,
                                        groups: visibleChats.groups.filter(
                                            (group) => group !== id
                                        ),
                                    });
                                }
                                if (type === 'receiver') {
                                    setVisibleChats({
                                        ...visibleChats,
                                        users: visibleChats.users.filter(
                                            (user) => user !== id
                                        ),
                                    });
                                }
                            }}
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
