import Avatar from './Avatar';
import React from 'react';

interface Props {
    name: string;
}

export default function ChatHeader({
    children,
    props,
}: {
    children: React.ReactNode;
    props: Props;
}) {
    const { name } = props;
    return (
        <div className="border-b-2 border-b-gray-200 py-3 px-6 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center space-x-1.5">
                <Avatar />
                <div className="flex flex-col">
                    <p className="text-xs text-gray-600">{name}</p>
                </div>
                {children}
            </div>
            <div className="space-x-1"></div>
        </div>
    );
}
