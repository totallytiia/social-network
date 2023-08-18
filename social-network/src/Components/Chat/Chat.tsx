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

interface IMessage {
    id: number;
    content: string;
    image: Blob | null;
    sender: number;
    receiver: number;
    timestamp: Date;
}

interface IChat {
    Messages: IMessage[];
    Receiver: {
        id: number;
        fname: string;
        lname: string;
        avatar: Blob | null;
    };
    Group: {
        id: number;
        name: string;
    };
}

export default function Chat({
    setVisibleChats,
    visibleChats,
    type,
    id,
    ws,
}: Props) {
    const [chat, setChat] = useState({
        Messages: [],
        Receiver: {
            id: 0,
            fname: '',
            lname: '',
            avatar: null,
        },
        Group: {
            id: 0,
            name: '',
        },
    } as IChat);

    useEffect(() => {
        async function getChat() {
            const url = `http://localhost:8080/api/chat/get?${type}_id=${id}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.errors) {
                return;
            }
            var dataChat: IChat = {
                Messages: [],
                Receiver: {
                    id: data.receiver.id,
                    fname: data.receiver.fname,
                    lname: data.receiver.lname,
                    avatar:
                        data.receiver.avatar !== ''
                            ? new Blob(data.receiver.avatar)
                            : null,
                },
                Group: {
                    id: data.group.id,
                    name: data.group.name,
                },
            };
            if (data.group.id)
                dataChat.Group = {
                    id: data.group.id,
                    name: data.group.name,
                };
            if (data.receiver.id)
                dataChat.Receiver = {
                    id: data.receiver.id,
                    fname: data.receiver.fName,
                    lname: data.receiver.lName,
                    avatar:
                        data.receiver.avatar !== ''
                            ? new Blob(data.receiver.avatar)
                            : null,
                };
            var messages: IMessage[] = [];
            if (data.messages !== null) {
                for (const message of data.messages) {
                    messages.push({
                        id: message.id,
                        content: message.message,
                        image: message.image,
                        sender: message.user_id,
                        receiver: message.receiver_id,
                        timestamp: message.sent_at,
                    });
                }
            }
            dataChat.Messages = messages;
            setChat(dataChat);
        }
        getChat();
    }, [id, type]);

    async function sendMessage(message: string, image: Blob | null) {
        const url = `http://localhost:8080/api/chat/send`;
        const FD = new FormData();
        FD.append('receiver_id', chat.Receiver.id.toString());
        FD.append('message', message);
        if (image !== null) FD.append('image', image);
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });
        const data = await res.json();
        if (data.errors) {
            return;
        }
        var chatCopy = { ...chat };
        chatCopy.Messages.push({
            id: data.id,
            content: message,
            image: image,
            sender: data.user_id,
            receiver: data.receiver_id,
            timestamp: data.sent_at,
        });
        setChat(chatCopy);
    }

    return (
        <div className="max-w-sm">
            <div className="CLOSE_CHAT flex flex-row justify-end items-center">
                <button
                    type="button"
                    className="font-medium text-sm text-center inline-flex items-center p-0.5"
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
            <div className="bg-blue-500 rounded-xl shadow-lg relative">
                <ChatHeader
                    props={{
                        name:
                            chat.Receiver !== undefined
                                ? `${chat.Receiver.fname} ${chat.Receiver.lname}`
                                : chat.Group.name,
                        avatar: chat.Receiver.avatar,
                    }}
                >
                </ChatHeader>
                <ChatContent
                    messages={chat.Messages}
                    avatar={chat.Receiver.avatar}
                />
                <ChatInputBox
                    sendMessage={sendMessage}
                    receiver={chat.Receiver}
                />
            </div>
        </div>
    );
}
