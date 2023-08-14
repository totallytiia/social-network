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
                <div
                    className="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50"
                    role="alert"
                >
                    <svg
                        className="flex-shrink-0 inline w-4 h-4 mr-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">{this.title}</span>
                    <div>
                        <span className="font-medium">Dark alert!</span>
                        {this.body}
                    </div>
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
