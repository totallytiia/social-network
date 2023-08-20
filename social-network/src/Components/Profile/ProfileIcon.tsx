interface Props {
    classNames?: string;
    avatar?: Blob | null;
}

export default function ProfileIcon({ avatar = null, classNames }: Props) {
    // Avatar is blob, add image if not null
    return (
        <img
            src={
                avatar !== null
                    ? avatar.toString()
                    : '/assets/tinydefault_profile.png'
            }
            alt="default avatar"
            className={`${classNames} object-cover`}
        />
    );
}
