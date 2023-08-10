import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../App/App';

interface WebSocketContextType {
    ws: WebSocket;
    setWS: Function;
}

const WSContext = createContext({} as WebSocketContextType);

export const useWS = () => useContext(WSContext);

export default function WSProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userData } = useContext(UserContext);
    const [ws, setWS] = useState(null as any);

    function defaultWS(userID: number) {
        const defaultWS = new WebSocket('ws://localhost:8080/api/ws');
        defaultWS.onopen = () => {
            defaultWS.send(
                JSON.stringify({
                    user_id: userID,
                })
            );
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
            {children}
        </WSContext.Provider>
    );
}
