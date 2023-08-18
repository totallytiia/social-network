import { useContext, useEffect, useState } from 'react';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../App/App';

interface IReceiver {
    id: number;
    fname: string;
    lname: string;
    avatar: Blob | null;
}

interface ILastChat {
    id: number;
    sender: number;
    receiver: IReceiver;
    group: number;
    message: string;
    image: Blob | null;
    sent_at: Date;
}

interface Props {
    // numUnseenMessages: number;
    visibleChats: { groups: number[]; users: number[] };
    setVisibleChats: React.Dispatch<
        React.SetStateAction<{ groups: number[]; users: number[] }>
    >;
}

export default function ChatList({
    // numUnseenMessages,
    visibleChats,
    setVisibleChats,
}: Props) {
    const [chatVisible, setChatVisible] = useState(true);
    const [lastChats, setLastChats] = useState([] as ILastChat[]);
    const [users, setUsers] = useState([] as IReceiver[]);

    const { userData } = useContext(UserContext);

    function handleUserSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const search = e.target.value.toLowerCase();
        const usersList = document.querySelector('ul#chatSearchUserList.USERS');
        if (usersList === null) {
            return;
        }
        const filteredUsers = users.filter((user) =>
            `${user.fname.toLowerCase()} ${user.lname.toLowerCase()}`.includes(
                search
            )
        );
        usersList.innerHTML = '';
        for (const user of filteredUsers) {
            const li = document.createElement('li');
            li.classList.add(
                'flex',
                'items-center',
                'p-1',
                'font-sm',
                'hover:bg-gray-200'
            );
            li.innerHTML = `
                <img src="${
                    user.avatar !== null
                        ? user.avatar
                        : '/assets/tinydefault_profile.png'
                }" alt="avatar" class="w-6 h-6 rounded-full object-cover mr-2">
                <span class="text-sm">${user.fname} ${user.lname}</span>
            `;
            li.addEventListener('click', () => {
                setVisibleChats({
                    ...visibleChats,
                    users: [...visibleChats.users, user.id],
                });
                setChatVisible(false);
            });
            usersList.appendChild(li);
        }
        if (filteredUsers.length === 0) {
            const li = document.createElement('li');
            li.classList.add('text-sm', 'p-2');
            li.textContent = 'No users found';
            usersList.appendChild(li);
        }
    }

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
                lastChats.push({
                    id: message.id,
                    sender: message.user_id,
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
    }, [visibleChats]);

    useEffect(() => {
        async function getUsers() {
            const url = 'http://localhost:8080/api/users/getall';
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status === 204) {
                setUsers([] as IReceiver[]);
                return;
            }
            const data = await res.json();
            if (data.errors) {
                return;
            }
            var users: IReceiver[] = [];
            for (const user of data) {
                console.log(user.avatar);
                users.push({
                    id: user.id,
                    fname: user.fName,
                    lname: user.lName,
                    avatar: user.avatar !== '' ? user.avatar : null,
                });
            }
            setUsers(users);
        }
        getUsers();
    }, []);

    if (!chatVisible) {
        return (
            <button onClick={() => setChatVisible(true)}>
                <ChatBubbleOvalLeftIcon className="fill-white w-10 h-10 m-2 bg-blue-500 rounded-full shadow p-2" />
                {/* {numUnseenMessages > 0 ? (
                    <div className="flex absolute right-2 -bottom-3 bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
                        {numUnseenMessages}
                    </div>
                ) : null} */}
            </button>
        );
    }

    return (
        <div className="mb-2 mr-2">
            <div className="CLOSE_CHAT flex flex-row justify-end items-center p-0.5">
                <button
                    type="button"
                    className=""
                    onClick={() => setChatVisible(false)}
                >
                    <XMarkIcon className="text-gray-600 w-5 h-5" />
                </button>
            </div>
            <div className="CHAT_LIST bg-white rounded-xl flex flex-col justify-between shadow-xl w-60">
                <div className="CHAT_LIST_HEADER_AND_USERS">
                    <div className="CHAT_LIST__HEADER shadow-[0px_2px_4px_0px_#EDF2F7]">
                        <div className="CHAT_LIST__HEADER__TITLE py-2 bg-blue-500 rounded-t-lg">
                            <h3 className="text-xs text-left text-white my-auto">
                                Recent chat
                            </h3>
                        </div>
                    </div>
                    <div className="CHAT_LIST__BODY">
                        <div className="CHAT_LIST__BODY__ITEM">
                            {lastChats.length === 0 ? (
                                <div className="m-2 text-xs">
                                    <p className="rounded-full bg-blue-100 px-2 py-1 w-fit">
                                        You have no chats.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {lastChats.map((lastChat) => (
                                        <div
                                            key={`lastChat-${lastChat.id}`}
                                            className="flex text-xs p-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => {
                                                if (
                                                    lastChat.receiver.id !==
                                                    null
                                                ) {
                                                    const visibleChatsCopy = {
                                                        ...visibleChats,
                                                    };
                                                    if (
                                                        visibleChatsCopy.users !==
                                                        undefined
                                                    )
                                                        visibleChatsCopy.users.push(
                                                            lastChat.receiver
                                                                .id ===
                                                                userData.id
                                                                ? lastChat.sender
                                                                : lastChat
                                                                      .receiver
                                                                      .id
                                                        );
                                                    setVisibleChats(
                                                        visibleChatsCopy
                                                    );
                                                } else {
                                                    const visibleChatsCopy = {
                                                        ...visibleChats,
                                                    };
                                                    if (
                                                        visibleChatsCopy.groups !==
                                                        undefined
                                                    )
                                                        visibleChatsCopy.groups.push(
                                                            lastChat.group
                                                        );
                                                    setVisibleChats(
                                                        visibleChatsCopy
                                                    );
                                                }
                                            }}
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
                                                    <p>
                                                        <span className="text-sm">{`${
                                                            lastChat.sender ===
                                                            userData.id
                                                                ? 'You: '
                                                                : 'Them: '
                                                        }`}</span>
                                                        {lastChat.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="CHAT_LIST__FOOTER__SEARCH flex flex-col shadow-[0px_-2px_4px_0px_#EDF2F7]">
                    <div className="bg-white hidden">
                        <ul className="USERS" id="chatSearchUserList"></ul>
                    </div>
                    <input
                        type="text"
                        className="text-xs outline-none"
                        name="chatReceiver"
                        id="chatReceiver"
                        placeholder="Search for users"
                        onChange={handleUserSearch}
                        onFocus={(e) =>
                            e.target.parentElement?.children[0].classList.remove(
                                'hidden'
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
