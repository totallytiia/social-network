export default function Comment(props: any) {



	return (
		<>
			<div className="flex flex-row gap-2">
				<div className="h-8 w-8 overflow-hidden rounded-full bg-pink-200 my-auto">
					<img className="" src={props.comment.user_avatar} alt="" />
				</div>
				<div className="flex flex-col text-sm bg-gray-50 my-1 p-2 rounded-lg">
					<div className="flex font-bold">
						<p>{props.comment.user_fname + " " + props.comment.user_lname}</p>
					</div>
					<div className="flex">
						<p>{props.comment.comment}</p>
					</div>
				</div>
			</div>
		</>
	)
}