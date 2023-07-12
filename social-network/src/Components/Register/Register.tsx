import { useState } from 'react';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | undefined;
    };
}

interface iForm extends iFormKeys {
    register: {
        fName: string;
        lName: string;
        email: string;
        nickname: string;
        dob: string;
        password: string;
        confirmPassword: string;
    };
}

export default function Register() {
    const [formData, setFormData] = useState({
        register: {
            fName: 'John',
            lName: 'Doe',
            email: 'john.doe@example.com',
            nickname: 'JohnnyDoe',
            dob: '01-01-1990',
            password: '',
            confirmPassword: '',
        },
    } as iForm);

    function formHandleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const form = e.target.parentElement?.attributes.getNamedItem('name')
            ?.value as string;
        const target = e.target;
        const value = target.value;
        const name = target.name;
        const formCopy = formData;
        formCopy[form][name] = value;
        setFormData(formCopy);
    }

    return (
        <>
            <div className="flex items-center justify-center bg-custom h-screen">
                <div className="bg-blue-50 flex flex-col w-80 rounded-lg px-5 py-5">
                    <div className="text-white mt-5">
                        <h1 className="font-bold text-4xl text-center text-black">
                            Welcome
                        </h1>
                        <p className="font-semibold text-black text-center ">
                            Let's create your account!
                        </p>
                    </div>
                    <form className="flex flex-col space-y-4 mt-5">
                        <input
                            type="text"
                            placeholder="First name"
                            className=""
                            name="fName"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="text"
                            placeholder="Last name"
                            className=""
                            name="lName"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            className=""
                        ></input>
                        <input
                            type="text"
                            placeholder="Nickname"
                            className=""
                            name="nickname"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="date"
                            placeholder="Date of birth"
                            className=""
                            name="dob"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="text"
                            placeholder="Password"
                            className=""
                            name="password"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="text"
                            placeholder="Confirm password"
                            className=""
                            name="confirmPassword"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <button className="btn-custom font-semibold">
                            Submit
                        </button>
                        <button className="text-sm text-gray-500">
                            Already have an account? Login here.
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
