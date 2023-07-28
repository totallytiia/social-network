export default function ErrorNotification({
    title,
    message,
}: {
    title: string;
    message: string;
}) {
    (document.querySelector('body') as HTMLElement).style.overflow = 'hidden';
    return (
        <>
            <div className="absolute top-0 left-0 z-50 bg-opacity-20 min-h-full min-w-full bg-gray-400">
                <div
                    id="alertErrorNotification"
                    className="absolute top-1/3 left-2/4 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-md shadow-md"
                >
                    <div className="bg-red-100 p-2" role="alert">
                        <h4 className="text-red-500 underline px-2">{title}</h4>
                        <p className="my-2 px-2">{message}</p>
                        <button
                            onClick={() => {
                                (
                                    document.getElementById(
                                        'alertErrorNotification'
                                    ) as HTMLElement
                                ).parentElement?.parentElement?.remove();
                                (
                                    document.querySelector(
                                        'body'
                                    ) as HTMLElement
                                ).style.overflow = 'auto';
                            }}
                            className="bg-red-800 text-white mx-1 px-2 py-1 rounded-md"
                        >
                            I understand and promise not to do it again
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
