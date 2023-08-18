import ChatList from '../Chat/ChatList';
import { useEffect, useRef, useState, useContext } from 'react';
import { WSContext } from '../WSProvider/WSProvider';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';
import Chat from '../Chat/Chat';
import Notification from '../Notification/Notification';

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
    // const [messages, setMessages] = useState([] as IMessage[]);
    // const [newMessage, setNewMessage] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const [visibleChats, setVisibleChats] = useState({
        groups: [],
        users: [],
    } as { groups: number[]; users: number[] });

    return (
        <>
            <div id="notifications" className="fixed bottom-2 left-2">
                <Notification />
            </div>
            <div id="chat" className="flex fixed bottom-2 right-2">
                <div id="chats" className="flex">
                    {visibleChats.groups !== undefined
                        ? visibleChats.groups.map((group) => (
                              <Chat
                                  key={group}
                                  type="group"
                                  id={group}
                                  ws={ws}
                                  setVisibleChats={setVisibleChats}
                                  visibleChats={visibleChats}
                              />
                          ))
                        : null}
                    {visibleChats.users !== undefined
                        ? visibleChats.users.map((user) => (
                              <Chat
                                  key={user}
                                  type="receiver"
                                  id={user}
                                  ws={ws}
                                  setVisibleChats={setVisibleChats}
                                  visibleChats={visibleChats}
                              />
                          ))
                        : null}
                </div>
                {chatVisible ? (
                    <ChatList
                        // numUnseenMessages={numUnseenMessages.current}
                        visibleChats={visibleChats}
                        setVisibleChats={setVisibleChats}
                    />
                ) : (
                    <button onClick={() => setChatVisible(true)}>
                        <ChatBubbleOvalLeftIcon className="fill-white w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2" />
                        {/* {numUnseenMessages.current > 0 ? (
                            <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
                                {numUnseenMessages.current}
                            </div>
                        ) : null} */}
                    </button>
                )}
            </div>

            <footer className="footer"></footer>
        </>
    );
}
