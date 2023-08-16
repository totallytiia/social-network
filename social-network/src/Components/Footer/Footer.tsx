import Chat from '../Chat/Chat';
import { useState } from 'react';

export default function Footer() {
    const [chatVisible, setChatVisible] = useState(false);
    return (
        <>
            <div id="notifications" className="absolute bottom-2 right-2">
                <Chat />
            </div>

            <footer className="footer"></footer>
        </>
    );
}
