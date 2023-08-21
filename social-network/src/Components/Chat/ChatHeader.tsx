import ProfileIcon from '../Profile/ProfileIcon';
import React from 'react';

interface Props {
    name: string;
    avatar: Blob | null;
}

export default function ChatHeader({ props }: { props: Props }) {
    const { name, avatar } = props;
    return (
        <div className="py-3 px-4 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center space-x-1.5">
                <ProfileIcon
                    avatar={avatar}
                    classNames="w-6 h-6 object-cover rounded-full shrink-0"
                />
                <div className="flex flex-col">
                    <p className="text-sm text-left font-bold text-white my-auto">
                        {name}
                    </p>
                </div>
            </div>
            <div className="space-x-1"></div>
        </div>
    );
}
