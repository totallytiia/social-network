import { useContext, useEffect } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Profile/ProfileIcon';

interface Message {
    id: number;
    content: string;
    image: Blob | null;
    sender: number;
    receiver: number;
    timestamp: Date;
}
interface Props {
    messages: Message[];
    avatar: Blob | null;
}

export default function ChatContent({ messages, avatar }: Props) {
    const { userData } = useContext(UserContext);

    return (
        <div className="max-h-64 bg-white h-64 px-2 py-1 overflow-auto">
            {messages !== undefined
                ? messages.map((message: Message, index: number) => (
                      <div
                          key={index}
                          className={`py-2 flex flex-row w-full ${
                              message.sender === userData.id
                                  ? 'justify-end'
                                  : 'justify-start'
                          }`}
                          onLoad={(e) => {
                              const target = (e.target as HTMLDivElement)
                                  .parentElement?.parentElement
                                  ?.parentElement as HTMLDivElement;
                              target.scrollTo(
                                  0,
                                  target?.scrollHeight as number
                              );
                          }}
                      >
                          <div
                              className={`${
                                  message.sender === userData.id
                                      ? 'order-1'
                                      : 'order-0'
                              }`}
                          >
                              <ProfileIcon
                                  avatar={avatar}
                                  classNames="w-5 h-5 rounded-full object-cover mt-1"
                              />
                          </div>
                          <div>
                              <div
                                  className={`px-3 w-fit py-2 flex flex-col text-sm rounded-lg text-black ${
                                      message.sender === userData.id
                                          ? 'order-0 mr-2 bg-blue-100'
                                          : 'order-1 ml-2 bg-gray-100'
                                  }`}
                              >
                                  <span className="text-md">
                                      {message.content}
                                  </span>
                              </div>
                              <div className="flex justify-end mr-3">
                                  <span className="text-xs text-gray-600">
                                      {new Date(
                                          message.timestamp
                                      ).toLocaleTimeString('fi-FI', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })}
                                  </span>
                              </div>
                          </div>
                      </div>
                  ))
                : null}
        </div>
    );
}
