export default function FourOneFour() {
    return (
        <>
            <div className="flex justify-center bg-custom min-h-screen">
                <div className="flex mt-60 flex-col w-80 rounded-lg px-5 py-5">
                    <div className="text-center mt-5">
                        <h1 className="font-bold text-8xl text-center text-black">
                            404
                        </h1>
                        <p className="font-semibold text-black text-center text-xl mb-4">
                            Page not found.
                        </p>
                        <a
                            className="text-black text-center bg-blue-100 p-2 rounded-lg"
                            href="/"
                        >
                            Go back home.
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
