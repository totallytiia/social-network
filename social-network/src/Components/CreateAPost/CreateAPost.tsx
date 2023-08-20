import { useContext, useState } from 'react';
import { UserContext } from '../App/App';
import ProfileIcon from '../Profile/ProfileIcon';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | undefined;
    };
}

interface iForm extends iFormKeys {
    post: {
        content: string;
        privacy: number;
        privacy_settings: string;
        imgUpload: string;
    };
}

interface iUser {
    id: number;
    fname: string;
    lname: string;
}

export default function CreateAPost(props: any) {
    const [userList, setUserList] = useState([] as iUser[]);
    const { userData } = useContext(UserContext);
    const [userListVisible, setUserListVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('0');

    const [postData, setPostData] = useState({
        post: {
            content: '',
            privacy: 0,
            privacy_settings: '',
            imgUpload: '',
        },
    } as iForm);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const FD = new FormData();
        FD.append('content', postData.post.content as string);
        FD.append('image', postData.post.imgUpload as string);
        FD.append('privacy', postData.post.privacy.toString() as string);
        FD.append(
            'privacy_settings',
            postData.post.privacy_settings.slice(
                0,
                postData.post.privacy_settings.length - 1
            ) as string
        );
        if (props.group !== undefined && props.group !== null) {
            FD.append('group_id', props.group.id as string);
        }

        const response = await fetch('http://localhost:8080/api/posts/create', {
            method: 'POST',
            credentials: 'include',
            body: FD,
        });

        (document.getElementById('content') as HTMLInputElement).value = '';
        (document.getElementById('imgUpload') as HTMLInputElement).value = '';
        setPostData({
            post: {
                content: '',
                privacy: 0,
                privacy_settings: '',
                imgUpload: '',
            },
        });

        document.getElementById('PostPlusIcon')?.classList.remove('hidden');
        document.getElementById('PostCheckIcon')?.classList.add('hidden');

        setUserListVisible(false);
        setSelectedOption('0');

        if (response.status === 201) {
            const post = await response.json();
            props.postAdded(post);
        } else {
            console.log(response);
        }
    };

    const getUserList = async () => {
        const response = await fetch('http://localhost:8080/api/users/getall', {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            console.log(response);
            return;
        }
        const data = await response.json();
        if (data === null) {
            console.log('no users found');
            return;
        }
        setUserList(data);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return;
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const postCopy = postData;
            postData.post.imgUpload = reader.result as string;
            setPostData(postCopy);
            document.getElementById('PostPlusIcon')?.classList.add('hidden');
            document
                .getElementById('PostCheckIcon')
                ?.classList.remove('hidden');
        };
        reader.readAsDataURL(file as Blob);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const postCopy = postData;
        if (e.target.checked) {
            postCopy.post.privacy_settings += e.target.value + ',';
        } else {
            postCopy.post.privacy_settings =
                postCopy.post.privacy_settings.replace(
                    e.target.value + ',',
                    ''
                );
        }
        setPostData(postCopy);
        console.log(postCopy.post.privacy_settings);
    };

    if (userData.id === undefined) return <></>;

    return (
        <div className="p-5 pb-3 bg-blue-50 rounded-xl">
            <form
                onSubmit={(e) => handlePostSubmit(e)}
                name="post"
                className="flex flex-col [&>input]:mb-2 [&>textarea]:mb-2 [&>*]:outline-none"
            >
                <div className="flex-row flex gap-2">
                    <div className="h-8 w-8 overflow-hidden object-cover rounded-full bg-pink-200">
                        <ProfileIcon
                            avatar={userData.avatar}
                            classNames="w-10 h-10"
                        />
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
                            <div className="relative flex flex-rows justify-end gap-2 [&>*]:outline-none md:gap-6">
                                <select
                                    value={selectedOption}
                                    className="cursor-pointer border-r-8 border-blue-100 hover:border-blue-200 btn-custom text-center text-sm  font-semibold p-1"
                                    onChange={(e) => {
                                        const postCopy = postData;
                                        postCopy.post.privacy = parseInt(
                                            e.target.value
                                        );
                                        setPostData(postCopy);
                                        setSelectedOption(e.target.value);
                                        if (e.target.value === '2') {
                                            setUserListVisible(true);
                                            getUserList();
                                        } else {
                                            setUserListVisible(false);
                                        }
                                    }}
                                >
                                    <option value="0">Public</option>
                                    <option value="2">Semi-private</option>
                                    <option value="1">Private</option>
                                </select>
                                <div className="USER_POPUP absolute top-10 right-32 bg-white rounded-xl overflow-scroll shadow-md max-h-36">
                                    {userListVisible
                                        ? userList.map((user: any) => {
                                              return (
                                                  <div
                                                      className="p-2 flex flex-row gap-1"
                                                      key={`userOption-${user.id}`}
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          name="user"
                                                          value={user.id}
                                                          className="my-auto"
                                                          onChange={
                                                              handleCheckboxChange
                                                          }
                                                      />
                                                      <label
                                                          htmlFor="user"
                                                          className="my-auto"
                                                      >
                                                          {user.fName}{' '}
                                                          {user.lName}
                                                      </label>
                                                  </div>
                                              );
                                          })
                                        : null}
                                </div>

                                <label
                                    htmlFor="imgUpload"
                                    className="my-auto relative cursor-pointer"
                                >
                                    <PlusIcon
                                        id={'PostPlusIcon'}
                                        className="cursor-pointer stroke-2 w-8 h-8 mr-1 my-auto bg-blue-500 shrink-0 stroke-white rounded-full p-1"
                                    />
                                    <CheckIcon
                                        id={'PostCheckIcon'}
                                        className="hidden cursor-pointer stroke-2 w-8 h-8 mr-1 my-auto bg-green-500 shrink-0 stroke-white rounded-full p-1"
                                    />
                                </label>
                                <input
                                    id="imgUpload"
                                    className="btn-custom hidden"
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg, image/gif"
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
