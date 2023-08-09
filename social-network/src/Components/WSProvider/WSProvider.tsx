import React, { createContext, useContext, useState } from 'react';

interface WebSocketContextType {
    ws: WebSocket;
    setWS: Function;
}

const defaultWS = new WebSocket('ws://localhost:8080/ws');

const WSContext = createContext({} as WebSocketContextType);

export const useWS = () => useContext(WSContext);

export default function WSProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [ws, setWS] = useState(defaultWS);
    return (
        <WSContext.Provider value={{ ws, setWS }}>
            {children}
        </WSContext.Provider>
    );
}
