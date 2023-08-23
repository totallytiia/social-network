import ChatList from '../Chat/ChatList';
import { useState, useContext, useEffect } from 'react';
import { WSContext } from '../WSProvider/WSProvider';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';
import Chat from '../Chat/Chat';
import Notification from '../Notification/Notification';
import { UserContext } from '../App/App';

export default function Footer() {
    const { ws } = useContext(WSContext);
    const { userData } = useContext(UserContext);
    // const [messages, setMessages] = useState([] as IMessage[]);
    // const [newMessage, setNewMessage] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const [visibleChats, setVisibleChats] = useState({
        groups: [],
        users: [],
    } as { groups: number[]; users: number[] });

    useEffect(() => {
        // Define the function inside the useEffect
        function handleNewMessage(e: MessageEvent) {
            const data = JSON.parse(e.data);
            console.log(data);
            if (data.type === 'chat') {
                const { group_id, receiver_id, user_id } = data.message;

                // Check if the chat is not already visible before updating state
                if (
                    !visibleChats.groups.includes(group_id) &&
                    !visibleChats.users.includes(user_id)
                ) {
                    setVisibleChats((prevChats) => ({
                        groups: [...prevChats.groups, group_id],
                        users: [...prevChats.users, user_id],
                    }));
                }
            }
        }

        if (ws !== null) {
            ws.addEventListener('message', handleNewMessage);

            // Cleanup: Remove the event listener when component unmounts or if ws changes
            return () => {
                ws.removeEventListener('message', handleNewMessage);
            };
        }
    }, [ws]); // Only re-run if ws changes

    return (
        <>
            <div id="notifications" className="fixed bottom-4 left-4">
                <Notification />
            </div>
            <div
                id="chat"
                className="flex flex-row gap-2 fixed bottom-2 right-2"
            >
                <div id="chats" className="flex gap-2 items-end">
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
