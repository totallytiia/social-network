import { useEffect, useState } from 'react';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import Chat from './Chat';

interface IReceiver {
    id: number;
    fname: string;
    lname: string;
    avatar: Blob | null;
}

interface ILastChat {
    id: number;
    receiver: IReceiver;
    group: number;
    message: string;
    image: Blob | null;
    sent_at: Date;
}

interface Props {
    numUnseenMessages: number;
}

export default function ChatList({ numUnseenMessages }: Props) {
    const [chatVisible, setChatVisible] = useState(true);
    const [lastChats, setLastChats] = useState([] as ILastChat[]);

    useEffect(() => {
        async function getLastChats() {
            const url = 'http://localhost:8080/api/chat/getlast';
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) {
                setLastChats([] as ILastChat[]);
                return;
            }
            const data = await res.json();
            if (data.errors) {
                return;
            }
            var lastChats: ILastChat[] = [];
            for (const message of data) {
                console.log(message);
                lastChats.push({
                    id: message.id,
                    receiver: {
                        id: message.receiver_id,
                        fname: message.receiver_fname,
                        lname: message.receiver_lname,
                        avatar:
                            message.receiver_avatar !== ''
                                ? new Blob(message.receiver_avatar)
                                : null,
                    },
                    group: message.group_id,
                    message: message.message,
                    image:
                        message.image !== '' ? new Blob(message.image) : null,
                    sent_at: new Date(message.sent_at),
                });
            }
            setLastChats(lastChats);
        }
        getLastChats();
    }, []);

    if (!chatVisible) {
        return (
            <button onClick={() => setChatVisible(true)}>
                <ChatBubbleOvalLeftIcon className="fill-white w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2" />
                {numUnseenMessages > 0 ? (
                    <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
                        {numUnseenMessages}
                    </div>
                ) : null}
            </button>
        );
    }

    return (
        <>
            <div className="CHAT_LIST">
                <div className="CHAT_LIST__HEADER">
                    <div className="CHAT_LIST__HEADER__TITLE">
                        <h3>Messages</h3>
                    </div>
                    <div className="CHAT_LIST__HEADER__SEARCH">
                        <label htmlFor="chatReceiver">Receiver: </label>
                        <input
                            type="text"
                            name="chatReceiver"
                            id="chatReceiver"
                        />
                    </div>
                </div>
                <div className="CHAT_LIST__BODY">
                    <div className="CHAT_LIST__BODY__ITEM">
                        {lastChats.map((lastChat) => (
                            <div
                                key={`lastChat-${lastChat.id}`}
                                className="flex font-medium p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => (
                                    <Chat setChatVisible={setChatVisible} />
                                )}
                            >
                                <div className="CHAT_LIST__BODY__ITEM__AVATAR">
                                    <img
                                        src="https://picsum.photos/200"
                                        alt="avatar"
                                        className="w-4 h-4 rounded-full m-1"
                                    />
                                </div>
                                <div className="CHAT_LIST__BODY__ITEM__CONTENT">
                                    <div className="CHAT_LIST__BODY__ITEM__CONTENT__NAME">
                                        <h4 className="font-bold">{`${lastChat.receiver.fname} ${lastChat.receiver.lname}`}</h4>
                                    </div>
                                    <div className="CHAT_LIST__BODY__ITEM__CONTENT__MESSAGE">
                                        <p>{lastChat.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <Chat setChatVisible={setChatVisible} /> */}
        </>
    );
}
