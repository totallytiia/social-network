import Chat from "../Chat/Chat";

export default function Footer() {
    return (
        <>
            <div id="notifications" className="absolute bottom-2 right-2">
                <Chat />
            </div>

            <footer className="footer"></footer>
        </>
    );
}
