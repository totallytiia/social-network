import { useState, useEffect } from "react";
import Comment from "./Comment";


interface IComments {
	id: number;
	user_id: number;
	user_fname: string;
	user_lname: string;
	user_nickname: string;
	user_avatar: Blob;
	post_id: number;
	comment: string;
	created_at: string;
	updated_at: string;
}


export default function CommentsSection() {

	// fetch comments data from backend
	const [commentsData, setCommentsData] = useState({
		comments: [] as IComments[],
	});

	useEffect(() => {
		const fetchCommentsData = async () => {
			const url = "http://localhost:8080/api/comments/getall?post_id=1";
			const res = await fetch(url, {
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();
			if (!data.errors) {
				console.log(data);
			}
			setCommentsData(data);
		};
		console.log(commentsData);
		fetchCommentsData();
	}, []);

	return (
		<>
			<div>
				{/* get all comments  */}
				{commentsData.comments.map((comment: any) => (
					<Comment comment={comment} />
				))}
			</div>
		</>
	)
}