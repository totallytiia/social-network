import { createContext, useContext } from 'react';

interface WS {
    connection: WebSocket;
}

const defaultWS: WS = {
    connection: new WebSocket('ws://localhost:8080/ws'),
};

const WSContext = createContext(defaultWS);

export const useWS = () => useContext(WSContext);

export default function WSProvider(children: []) {
    return <WSContext.Provider>{children}</WSContext.Provider>;
}
