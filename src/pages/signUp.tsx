import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function SignUp() {
    const [role, setRole] = useState<string>("user");
    const [submitClicked, setSubmitClicked] = useState(false);
    const navigate = useNavigate();

    const changeSignUpType = (e: React.MouseEvent, type: string) => {
        e.preventDefault();
        setRole(type);
    }

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            const formTarget = e.target as HTMLFormElement;
            const formData = new FormData(formTarget);
            formData.append("role", role);

            const payload = Object.fromEntries(formData.entries()); 

            if (!(formData.get("email") && formData.get("name") && formData.get("password")) || !role) {
                toast.error("Enter required fields!");
                setSubmitClicked(false);
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/sign-up`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            )

            if (response.status == 200 || response.status == 201) {
                toast.success("Congrats! registered successfully!");
                navigate("/log-in")
                setSubmitClicked(false);
                return;
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message ?? "Internal server error!";
                toast.error(message);
            }
            setSubmitClicked(false);
        }
    }

    return (
        <>
            <section className='w-screen h-screen flex justify-center items-center bg-linear-to-b from-gray-200 to-white'>
                <aside className="w-1/2 h-screen flex flex-col justify-center gap-6 px-20">
                    <p className="text-5xl font-bold text-gray-900 leading-tight">
                        <span className="text-4xl">
                        Join as a&nbsp;
                        </span>
                            <span className="inline-block text-purple-500">
                                {role === "user" ? "User!" : "Seller!"}
                            </span>
                        <br />
                        <span className="text-purple-500">Sign up</span>
                        <span className="text-3xl">
                        &nbsp;to unlock best
                        <br />
                        E-Commerce experiences
                        </span>
                    </p>

                    <p className="text-xl text-gray-700 font-medium">
                        Already have an account?
                        <Link to="/log-in">
                            <span className="text-gray-900 font-bold underline"> Log In </span>
                        </Link>
                    </p>

                </aside>

                <aside className='w-1/2 h-screen flex justify-center items-center'>
                    <form method='post' className='bg-white relative mx-auto h-fit mt-12 w-3/5 px-10 pt-4 pb-8 rounded-xl shadow-md shadow-gray-300' onSubmit={signUp}>
                        <fieldset>
                            <div className='w-full relative'>
                                <button className={`${role === "user" ? "text-gray-900" : "text-gray-500"} rounded-t-md w-1/2 py-3 font-medium`} onClick={(e) => changeSignUpType(e, "user")}>
                                    User
                                </button>

                                <button className={`${role === "seller" ? "text-gray-900" : "text-gray-500"} rounded-t-md w-1/2 py-3 font-medium`} onClick={(e) => changeSignUpType(e, "seller")}>
                                    Seller
                                </button>

                                <div className={`w-1/2 h-[3px] bg-gray-900 rounded-md ${role == "user" ? "translate-x-0" : "translate-x-full"} transition-all duration-200`} />
                            </div>

                            <div className='my-6'>
                                <p className='text-center font-bold text-2xl text-gray-900'> Create Account</p>
                                <p className='text-center text-xs text-gray-500 my-2'>Please enter your cpurpleentials to create account</p>
                            </div>

                            <div className='text-left'>
                                <label className='text-sm text-gray-500 font-semibold' htmlFor='email'>Email address </label>
                                <br />
                                <input type='email' placeholder='youremail@gmail.com' name='email' className='h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none' autoFocus />
                                <br /><br />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='name'> Name </label>
                                <br />
                                <input type='name' placeholder='your name' name='name' className='h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none' />
                                <br /><br />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='password'>Password </label>
                                <br />
                                <input type='password' placeholder='......' name='password' className='h-12 mt-2 px-3 w-full placeholder:text-7xl border-2 border-gray-200 rounded-md outline-none' />

                                <div className='text-center mt-8'>
                                    <input type='submit' className={`w-full cursor-pointer ${submitClicked ? "bg-purple-400" : "bg-purple-500"} rounded-lg py-3 text-white font-semibold`} value={submitClicked ? "Signing Up..." : "Sign Up"} disabled={submitClicked} />
                                </div>

                            </div>

                        </fieldset>
                    </form>
                </aside>
            </section>
        </>
    )
}