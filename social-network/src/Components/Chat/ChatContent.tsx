import { useContext } from 'react';
import { UserContext } from '../App/App';
import Avatar from './Avatar';

interface Message {
    id: number;
    content: string;
    image: Blob;
    sender: number;
    receiver: number;
    timestamp: Date;
}
interface Props {
    messages: Message[];
}

export default function ChatContent(props: Props) {
    const { messages } = props;
    const { userData } = useContext(UserContext);

    return (
        <div className="max-h-64 h-64 px-6 py-1 overflow-auto">
            {messages.map((message: Message, index: number) => (
                <div
                    key={index}
                    className={`py-2 flex flex-row w-full ${
                        message.sender === userData.id
                            ? 'justify-end'
                            : 'justify-start'
                    }`}
                >
                    <div
                        className={`${
                            message.sender === userData.id
                                ? 'order-2'
                                : 'order-1'
                        }`}
                    >
                        <Avatar />
                    </div>
                    <div
                        className={`px-2 w-fit py-3 flex flex-col bg-purple-500 rounded-lg text-white ${
                            message.sender === userData.id
                                ? 'order-1 mr-2'
                                : 'order-2 ml-2'
                        }`}
                    >
                        <span className="text-xs text-gray-200">
                            {message.sender}&nbsp;-&nbsp;
                            {new Date(message.timestamp).toLocaleTimeString(
                                'en-US',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}
                        </span>
                        <span className="text-md">{message.content}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
