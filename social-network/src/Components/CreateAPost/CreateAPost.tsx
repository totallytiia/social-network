import { useContext, useState } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Posts/ProfileIcon';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | undefined;
    };
}

interface iForm extends iFormKeys {
    post: {
        content: string;
        privacy: number;
        imgUpload: string;
    };
}

export default function CreateAPost(props: any) {
    const { userData } = useContext(UserContext);

    const [postData, setPostData] = useState({
        post: {
            content: '',
            privacy: 0,
            imgUpload: '',
        },
    } as iForm);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const FD = new FormData();
        FD.append('content', postData.post.content as string);
        FD.append('image', postData.post.imgUpload as string);
        FD.append('privacy', postData.post.privacy.toString() as string);
        FD.append('privacy_settings', '' as string);

        const response = await fetch('http://localhost:8080/api/posts/create', {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });

        (document.getElementById('content') as HTMLInputElement).value = '';
        (document.getElementById('imgUpload') as HTMLInputElement).value = '';

        if (response.status === 201) {
            const post = await response.json();
            props.postAdded(post);
        } else {
            console.log(response);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return;
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const postCopy = postData;
            postData.post.imgUpload = reader.result as string;
            setPostData(postCopy);
            document
                .getElementById('imgUpload')!
                .setAttribute('src', postData.post.imgUpload as string);
            document.getElementById('svgUpload')!.classList.add('hidden');
            document.getElementById('uploadedImg')!.classList.remove('hidden');
        };
        reader.readAsDataURL(file as Blob);
    };

    return (
        // create a post (form), needs to have body, and group selection, upload image, and submit button
        <div className="mt-4 mx-6 mb-0 p-5 pb-3 bg-blue-50 rounded-xl">
            <form
                onSubmit={(e) => handlePostSubmit(e)}
                name="post"
                className="flex flex-col [&>input]:mb-2 [&>textarea]:mb-2 [&>*]:outline-none"
            >
                <div className="flex-row flex gap-2">
                    <div className="shrink-0 h-8 w-8 relative overflow-hidden object-cover rounded-full bg-pink-200">
                        <img
                            className="border-none outline-none"
                            src={
                                userData.avatar !== undefined
                                    ? userData.avatar.toString()
                                    : ''
                            }
                            alt=""
                        />
                        <ProfileIcon classNames="w-10 h-10" />
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-2">
                            <textarea
                                placeholder="Write something..."
                                name="content"
                                onChange={(e) => {
                                    const postCopy = postData;
                                    postCopy.post.content = e.target.value;
                                    setPostData(postCopy);
                                }}
                                id="content"
                                rows={5}
                                className="rounded-md text-sm p-1.5 outline-none"
                                required
                            ></textarea>
                            <div className="flex flex-rows justify-end gap-2 [&>*]:outline-none md:gap-6">
                                <select
                                    className="cursor-pointer border-r-8 border-blue-100 hover:border-blue-200 btn-custom text-center text-sm  font-semibold p-1"
                                    onChange={(e) => {
                                        const postCopy = postData;
                                        postCopy.post.privacy = parseInt(
                                            e.target.value
                                        );
                                        setPostData(postCopy);
                                    }}
                                >
                                    <option value="0">Public</option>
                                    <option value="2">Semi-private</option>
                                    <option value="1">Private</option>
                                </select>
                                <label
                                    htmlFor="imgUpload"
                                    className="my-auto relative cursor-pointer"
                                >
                                    <img
                                        id="uploadedImg"
                                        src={postData.post.imgUpload}
                                        className=" hidden border-none w-8 h-8 rounded-full object-cover shadow-lg"
                                        alt=""
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        id="svgUpload"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-8 h-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                </label>
                                <input
                                    id="imgUpload"
                                    className="btn-custom hidden"
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg"
                                    onChange={(e) => handleImageUpload(e)}
                                />
                                <input
                                    type="submit"
                                    id="submitBtn"
                                    value="Submit"
                                    className="btn-custom font-semibold cursor-pointer"
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
