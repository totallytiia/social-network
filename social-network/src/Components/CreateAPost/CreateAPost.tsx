import { useContext, useState } from 'react';
import { UserContext } from '../App/App';

interface iFormKeys {
	[key: string]: {
		[key: string]: string | number | undefined;
	};
}

interface iForm extends iFormKeys {
	post: {
		title: string;
		content: string;
		privacy: number;
		imgUpload: string;
	};
}

export default function CreateAPost(props: any) {

	const { userData } = useContext(UserContext);

	const [postData, setpostData] = useState({
		post: {
			title: '',
			content: '',
			privacy: 0,
			imgUpload: '',
		},
	} as iForm);

	const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(postData.post);
		const FD = new FormData();
		FD.append('title', postData.post.title as string);
		FD.append('content', postData.post.content as string);
		FD.append('image', postData.post.imgUpload as string);
		FD.append('privacy', postData.post.privacy as number);
		FD.append('privacy_settings', '' as string);

		const response = await fetch('http://localhost:8080/api/posts/create', {
			method: 'POST',
			credentials: 'include',
			body: FD,
		});

		(document.getElementById('title') as HTMLInputElement).value = '';
		(document.getElementById('content') as HTMLInputElement).value = '';
		(document.getElementById('group_id') as HTMLInputElement).value = '';
		(document.getElementById('imgUpload') as HTMLInputElement).value = '';

		if (response.status === 201) {
			console.log('Post created!');
			// Send await response.json() to the parent
			const post = await response.json();
			props.postAdded(post);

		} else {
			console.log('Error creating post!');
			console.log(response);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length === 0) return;
		console.log(e.target.files);
		const file = e.target.files?.[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			const postCopy = postData;
			postData.post.imgUpload = reader.result as string;
			setpostData(postCopy);
			document
				.getElementById('imgUpload')!
				.setAttribute('src', postData.post.imgUpload as string);
			document
				.getElementById('svgUpload')!
				.classList.add(
					'hidden'
				);
			document
				.getElementById('uploadedImg')!
				.classList.remove(
					'hidden'
				);
		};
		reader.readAsDataURL(file as Blob);
	};

	return (
		// create a post (form), needs to have title, body, and group selection, upload image, and submit button
		<div className="mt-4 mx-6 mb-0 p-5 pb-3 bg-blue-50 rounded-xl">
			<form
				onSubmit={(e) => handlePostSubmit(e)}
				name="post"
				className="flex flex-col [&>input]:mb-2 [&>textarea]:mb-2 [&>*]:outline-none"
			>
				<div className='flex-row flex gap-2'>
					<div>
						<div className='h-10 w-10 overflow-hidden rounded-full bg-black'>
							<img src={userData.avatar} alt="" />
						</div>
					</div>
					<div className='w-full'>

						{/* <input
					type="title"
					name="title"
					onChange={(e) => {
						console.log(e.target.value);
						const postCopy = postData;
						postCopy.post.title = e.target.value;
						setpostData(postCopy);
					}}
					placeholder="Title"
					id="title"
					className="w-full"
					required
				></input> */}
						<div className='flex flex-col gap-2'>
							<textarea
								placeholder="Write something..."
								name="content"
								onChange={(e) => {
									console.log(e.target.value);
									const postCopy = postData;
									postCopy.post.content = e.target.value;
									setpostData(postCopy);
								}}
								id="content"
								rows={5}
								className="rounded-md text-sm p-1.5"
								required
							></textarea>
							<div className="flex flex-rows justify-end gap-2 [&>*]:outline-none md:gap-6">
								<select
									className='btn-custom text-center text-sm  font-semibold p-1'
									onChange={(e) => {
										console.log(e.target.value);
										const postCopy = postData;
										postCopy.post.privacy = e.target.value;
										setpostData(postCopy);
									}}>
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
										className=" hidden border-none w-8 h-8 rounded-full object-cover shadow-lg shadow"
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
									className="btn-custom font-semibold"
								></input>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
