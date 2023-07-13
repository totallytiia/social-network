import { useState } from 'react';

interface iFormKeys {
    [key: string]: {
        [key: string]: string | number | undefined;
    };
}

interface iForm extends iFormKeys {
    register: {
        avatar: string;
        fName: string;
        lName: string;
        email: string;
        nickname: string;
        dob: string;
        about: string;
        password: string;
        confirmPassword: string;
    };
}

export default function Register() {
    const [formData, setFormData] = useState({
        register: {
            avatar: '',
            fName: '',
            lName: '',
            email: '',
            nickname: '',
            dob: '',
            about: '',
            password: '',
            confirmPassword: '',
        },
    } as iForm);

    function formHandleChangeInput(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        const form = e.target.parentElement?.attributes.getNamedItem('name')
            ?.value as string;
        const target = e.target;
        const value = target.value;
        // VALIDATE VALUE, WHAT TARGET IS, ETC
        switch (target.name) {
            case 'fName':
                if (value.length < 2 || value.length > 18) {
                    console.log('error');
                    e.target.classList.add('border-red-500', 'border-2', 'border-solid');
                    e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'true');
                    return
                }
                e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'false');
                e.target.classList.remove('border-red-500', 'border-2', 'border-solid');
                break;
            case 'lName':
                if (value.length < 2 || value.length > 20) {
                    console.log('error');
                    e.target.classList.add('border-red-500', 'border-2', 'border-solid');
                    e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'true');
                    return
                }
                e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'false');
                e.target.classList.remove('border-red-500', 'border-2', 'border-solid');
                break;
            case 'email':
                if (!/^[^ ]+@[^ ]+.[a-z]{2,3}$/g.test(e.target.value)) {
                    e.target.classList.add('border-red-500', 'border-2', 'border-solid');
                    e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'true');
                    return
                }
                e.target.parentElement?.querySelector('button')?.setAttribute('disabled', 'false');
                e.target.classList.remove('border-red-500', 'border-2', 'border-solid');
                break;
            case 'dob':
            // if (+e.target.value < 18) {
            //     age.cL().add('invalid');
            //     ageError.cL().remove('hidden');
            //     registerButton.disabled = true;
            // } else {
            //     age.cL().remove('invalid');
            //     ageError.cL().add('hidden');
            //     registerButton.disabled = false;
            // }
            case 'password':
            // let formatSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            // let formatVersal = /[A-Z]/;
            // if (
            //     formatSpecial.test(e.target.value) === false ||
            //     formatVersal.test(e.target.value) === false ||
            //     e.target.value.length < 8
            // ) {
            //     pass.cL().add('invalid');
            //     passwordError.cL().remove('hidden');
            //     registerButton.disabled = true;
            // } else if (e.target.value !== pass.value) {
            // } else {
            //     pass.cL().remove('invalid');
            //     passwordError.cL().add('hidden');
            //     registerButton.disabled = false;
            // }
            case 'confirmPassword':
            // PASSWORDS MATCH
        }

        console.log(target.name, value);


        const name = target.name;
        const formCopy = formData;
        formCopy[form][name] = value;
        setFormData(formCopy);
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length === 0) return;
        console.log(e.target.files);
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const formCopy = formData;
            formCopy.register.avatar = reader.result as string;
            setFormData(formCopy);
            document.getElementById('avatarDisplay')!.setAttribute('src', formData.register.avatar as string);
            document.getElementById('avatarDisplay')!.parentElement!.classList.remove('border-dashed', 'border-2', 'border-gray-300');
            document.getElementById('avatarDisplay')!.classList.add('h-24', 'w-24', 'rounded-full', 'overflow-hidden', 'object-cover', 'shadow-lg', 'shadow');
        };
        reader.readAsDataURL(file as Blob);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const FD = new FormData();
        FD.append('avatar', formData.register.avatar as string);
        FD.append('fName', formData.register.fName as string);
        FD.append('lName', formData.register.lName as string);
        FD.append('email', formData.register.email as string);
        FD.append('nickname', formData.register.nickname as string);
        FD.append('dob', formData.register.dob as string);
        FD.append('about', formData.register.about as string);
        FD.append('password', formData.register.password as string);

        const response = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            body: FD,
        });
        if (response.status === 200) {
            console.log('success');
            // show home page

        } else {
            console.log('error');
            // show error message
        }
    };


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
                    <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 mt-5" name="register">
                        <div className="flex justify-center align-center flex-col">
                            <label htmlFor='imgUpload'>
                                <div className='h-24 w-24 flex justify-center mx-auto relative border-dashed border-2 border-gray-300 rounded-full'>
                                    <img id="avatarDisplay" src="" className="absolute border-none" />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="lightgray" className="w-10 h-10 flex my-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>

                                </div>
                            </label>
                            <input id="imgUpload" className="btn-custom hidden" type="file" accept="image/png, image/jpg, image/jpeg" onChange={(e) => handleImageUpload(e)} />
                        </div>
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
                            onChange={(e) => formHandleChangeInput(e)}
                        ></input>
                        <input
                            type="text"
                            placeholder="Nickname (optional)"
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
                        <textarea
                            placeholder="About me (optional)"
                            className="rounded-lg p-2 text-sm"
                            name="about"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></textarea>
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
                        <input type="submit" value="Register" className="btn-custom font-semibold">
                        </input>
                        <button className="text-sm text-gray-500">
                            Already have an account? Login here.
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
