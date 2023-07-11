import { useState } from 'react';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fName, setFName] = useState('');
	const [lName, setLName] = useState('');
	const [username, setusername] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');

	return (
		<>
			<div className="flex items-center justify-center bg-custom h-screen">
				<div className="bg-blue-50 flex flex-col w-80 rounded-lg px-5 py-5">
					<div className="text-white mt-5">
						<h1 className="font-bold text-4xl text-center text-black">Welcome</h1>
						<p className="font-semibold text-black text-center ">Let's create your account!</p>
					</div>
					<form className="flex flex-col space-y-4 mt-5">
						<input type="text" placeholder="First name" className=""></input>
						<input type="text" placeholder="Last name" className=""></input>
						<input type="text" placeholder="Email" className=""></input>
						<input type="text" placeholder="Username" className=""></input>
						<input type="date" placeholder="Date of birth" className=""></input>
						<input type="text" placeholder="Password" className=""></input>
						<input type="text" placeholder="Confirm password" className=""></input>
						<button className="btn-custom font-semibold">Submit</button>
						<button className='text-sm text-gray-500'>Already have an account? Login here.</button>
					</form>
				</div>
			</div>
		</>
	)
}