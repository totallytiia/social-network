import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../App/App';

interface WebSocketContextType {
    ws: WebSocket;
    setWS: Function;
}

interface NewMessageContextType {
    newMessage: number;
    setNewMessage: Function;
}

export const WSContext = createContext({} as WebSocketContextType);
export const NewMessageContext = createContext({} as NewMessageContextType);

export const useWS = () => useContext(WSContext);

export default function WSProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userData } = useContext(UserContext);
    const [ws, setWS] = useState(null as any);
    const [newMessage, setNewMessage] = useState(0 as number);

    function defaultWS(userID: number) {
        const defaultWS = new WebSocket('ws://localhost:8080/api/ws');
        defaultWS.onerror = (e: Event) => {
            console.error('WebSocket error:', e);
        };
        defaultWS.onopen = (e: Event) => {
            defaultWS.send(
                JSON.stringify({
                    user_id: userID,
                })
            );
        };
        defaultWS.onclose = (e: CloseEvent) => {
            console.log('WebSocket closed:', e);
        };
        defaultWS.onmessage = (e: MessageEvent) => {
            const message = JSON.parse(e.data);
            console.log('WebSocket message:');
            console.log(message);
            if (message.type === 'chat') setNewMessage(message.message.user_id);
        };
        return defaultWS;
    }

    useEffect(() => {
        if (userData.id != null) {
            setWS(defaultWS(userData.id));
        }
    }, [userData]);

    return (
        <WSContext.Provider value={{ ws, setWS }}>
            <NewMessageContext.Provider value={{ newMessage, setNewMessage }}>
                {children}
            </NewMessageContext.Provider>
        </WSContext.Provider>
    );
}
