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
        private: string;
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
            private: 'false',
        },
    } as iForm);

    function formHandleChangeInput(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const form = e.target.parentElement?.attributes.getNamedItem('name')
            ?.value as string;
        const target = e.target;
        var value = target.value;
        // VALIDATE VALUE, WHAT TARGET IS, ETC
        switch (target.name) {
            case 'fName':
                if (value.length < 2 || value.length > 18) {
                    console.log('error');
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    // remove hidden class from error message id="fNameErrorMsg"
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('fNameErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('fNameErrorMsg')!
                    .classList.add('hidden');
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                break;
            case 'lName':
                if (value.length < 2 || value.length > 20) {
                    console.log('error');
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('lNameErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                document
                    .getElementById('lNameErrorMsg')!
                    .classList.add('hidden');
                break;
            case 'email':
                if (!/^[^ ]+@[^ ]+.[a-z]{2,3}$/g.test(value)) {
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('emailErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                document
                    .getElementById('emailErrorMsg')!
                    .classList.add('hidden');
                break;
            case 'dob':
                const today: Date = new Date();
                const birthdate: Date = new Date(value);
                const age: number =
                    today.getFullYear() -
                    birthdate.getFullYear() -
                    (today.getMonth() < birthdate.getMonth() ||
                    (today.getMonth() === birthdate.getMonth() &&
                        today.getDate() < birthdate.getDate())
                        ? 1
                        : 0);
                if (age < 18) {
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('dobErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                document.getElementById('dobErrorMsg')!.classList.add('hidden');
                break;
            case 'password':
                // eslint-disable-next-line
                let formatSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
                let formatVersal = /[A-Z]/;
                if (
                    formatSpecial.test(value) === false ||
                    formatVersal.test(value) === false ||
                    value.length < 8
                ) {
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('pwErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                document.getElementById('pwErrorMsg')!.classList.add('hidden');
                break;
            case 'confirmPassword':
                if (value !== formData.register.password) {
                    e.target.classList.add(
                        'border-red-500',
                        'border-2',
                        'border-solid'
                    );
                    document
                        .getElementById('submitBtn')
                        ?.setAttribute('disabled', '');
                    document
                        .getElementById('pw2ErrorMsg')!
                        .classList.remove('hidden');
                    return;
                }
                document
                    .getElementById('submitBtn')
                    ?.removeAttribute('disabled');
                e.target.classList.remove(
                    'border-red-500',
                    'border-2',
                    'border-solid'
                );
                document.getElementById('pw2ErrorMsg')!.classList.add('hidden');
                break;
            case 'private':
                value = (e.target as any).checked;
        }
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
            document
                .getElementById('avatarDisplay')!
                .setAttribute('src', formData.register.avatar as string);
            document
                .getElementById('avatarDisplay')!
                .parentElement!.classList.remove(
                    'border-dashed',
                    'border-2',
                    'border-gray-300'
                );
            document
                .getElementById('avatarDisplay')!
                .classList.add(
                    'h-24',
                    'w-24',
                    'rounded-full',
                    'overflow-hidden',
                    'object-cover',
                    'shadow-lg',
                    'shadow'
                );
        };
        reader.readAsDataURL(file as Blob);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        const FD = new FormData();
        FD.append('avatar', formData.register.avatar as string);
        FD.append('fname', formData.register.fName as string);
        FD.append('lname', formData.register.lName as string);
        FD.append('email', formData.register.email as string);
        FD.append('nickname', formData.register.nickname as string);
        FD.append('date_of_birth', formData.register.dob as string);
        FD.append('about', formData.register.about as string);
        FD.append('password', formData.register.password as string);
        FD.append('private', formData.register.private as string);

        const response = await fetch(
            'http://localhost:8080/api/users/register',
            {
                method: 'POST',
                body: FD,
            }
        );
        console.log(response.status);
        if (response.status === 200) {
            console.log('success');
            window.location.href = '/login';
            // show home page
        } else {
            console.log('error');
            console.log(response);
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
                    <form
                        onSubmit={(e) => handleFormSubmit(e)}
                        className="flex flex-col space-y-4 mt-5"
                        name="register"
                    >
                        <div className="flex justify-center align-center flex-col">
                            {/* IMG UPLOAD HERE */}
                            <label htmlFor="imgUpload">
                                <div className="h-24 w-24 flex justify-center mx-auto relative border-dashed border-2 border-gray-300 rounded-full">
                                    <img
                                        id="avatarDisplay"
                                        src=""
                                        className="absolute border-none"
                                        alt=""
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="lightgray"
                                        className="w-10 h-10 flex my-auto"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                </div>
                            </label>
                            <input
                                id="imgUpload"
                                className="btn-custom hidden"
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={(e) => handleImageUpload(e)}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="First name"
                            className=""
                            name="fName"
                            onChange={(e) => formHandleChangeInput(e)}
                            required
                        ></input>
                        <p
                            id="fNameErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            Needs to be at least 2 characters.
                        </p>
                        <input
                            type="text"
                            placeholder="Last name"
                            className=""
                            name="lName"
                            onChange={(e) => formHandleChangeInput(e)}
                            required
                        ></input>
                        <p
                            id="lNameErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            Needs to be at least 2 characters.
                        </p>
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            className=""
                            onChange={(e) => formHandleChangeInput(e)}
                            required
                        ></input>
                        <p
                            id="emailErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            Not valid email.
                        </p>
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
                            required
                        ></input>
                        <p
                            id="dobErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            You need to be at least 18 years old.
                        </p>
                        <textarea
                            placeholder="About me (optional)"
                            className="rounded-lg p-2 text-sm"
                            name="about"
                            onChange={(e) => formHandleChangeInput(e)}
                        ></textarea>
                        <input
                            type="password"
                            placeholder="Password"
                            className=""
                            name="password"
                            onChange={(e) => formHandleChangeInput(e)}
                            required
                        ></input>
                        <p
                            id="pwErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            Password has to be at least 8 characters, 1
                            uppercase, 1 lowercase, 1 digit and 1 special
                            character.
                        </p>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className=""
                            name="confirmPassword"
                            onChange={(e) => formHandleChangeInput(e)}
                            required
                        ></input>
                        <p
                            id="pw2ErrorMsg"
                            className="hidden text-xs !mt-1 ml-2 mb-1"
                        >
                            Passwords don't match, try again.
                        </p>
                        <div className="flex flex-row ml-2">
                            <label
                                className="mb-0 font-normal"
                                htmlFor="private"
                            >
                                Private Account
                            </label>
                            <input
                                className="ml-2"
                                type="checkbox"
                                name="private"
                                onChange={(e) => formHandleChangeInput(e)}
                            />
                        </div>
                        <input
                            type="submit"
                            id="submitBtn"
                            value="Register"
                            className="btn-custom font-semibold"
                        ></input>
                    </form>
                    <button
                        onClick={() => (window.location.href = '/login')}
                        className="text-sm text-gray-500 mt-3"
                    >
                        Already have an account? Login here.
                    </button>
                </div>
            </div>
        </>
    );
}
