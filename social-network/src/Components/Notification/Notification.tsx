import { createRoot } from 'react-dom/client';

export default class Notification {
    private type: string | undefined;
    private title: string | undefined;
    private body: string | undefined;
    private html: JSX.Element | undefined;
    constructor(type: string, title: string, body: string) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.html = this.createHTML();
        this.show();
    }
    private createHTML() {
        console.log(this.type, this.title, this.body);
        return (
            <>
                <div>
                    {/*
                        TODO: Tiia create HTML for notification
                    */}
                </div>
            </>
        );
    }
    private show() {
        const notifications = document.getElementById('notifications');
        if (!notifications) throw new Error('Notifications root not found');
        const notificationsRoot = createRoot(notifications);
        notificationsRoot.render(this.html);
    }
}
