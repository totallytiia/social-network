import { UserIcon } from '@heroicons/react/24/outline';

interface Props {
    classNames?: string;
    avatar?: Blob | null;
}

export default function ProfileIcon({ avatar = null, classNames }: Props) {
    // Avatar is blob, add image if not null
    return (
        <img
            src="/assets/tinydefault_profile.png"
            alt="default avatar"
            className={classNames}
        />
    );
}
