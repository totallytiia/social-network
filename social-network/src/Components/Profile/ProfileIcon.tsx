interface Props {
    classNames?: string;
    avatar?: Blob | null;
}

export default function ProfileIcon({ avatar = null, classNames }: Props) {
    return (
        <img
            src={
                avatar !== null && avatar.toString() !== ''
                    ? avatar.toString()
                    : '/assets/tinydefault_profile.png'
            }
            alt="default avatar"
            className={`${classNames} object-cover`}
        />
    );
}
