import { SetStateAction, useState } from 'react';
import Header from '../Header/Header';

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');




	return (
		<>
			<div className="flex items-center justify-center bg-custom h-screen">
				<div className="bg-blue-50 flex flex-col w-80 rounded-lg px-5 py-5">
					<div className="text-white mt-5">
						<h1 className="font-bold text-4xl text-center text-black">Welcome</h1>
						<p className="font-semibold text-black text-center ">Log in to your account here!</p>
					</div>
					<form className="flex flex-col space-y-4 mt-5">
						<input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" id="Email" className=""></input>
						<input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" id="password " className=""></input>
						<button className="btn-custom font-semibold">Submit</button>
					</form>
					<button onClick={() => window.location.href = "/register"} className='text-sm text-gray-500 mt-3'>Don't have an account? Register here.</button>
				</div>
			</div >
		</>
	)
}
