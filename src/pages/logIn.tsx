import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "../redux/hooks";
import { setToken, setUser } from "../redux/slices/user";

export default function LogIn() {
    const [role, setRole] = useState<string>("user");
    const [submitClicked, setSubmitClicked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const changeLogInType = (e: React.MouseEvent, type: string) => {
        e.preventDefault();
        setRole(type);
    }

    const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitClicked(true);
        try {
            const target = e.target as HTMLFormElement;
            const formData = new FormData(target);
            formData.append("role", role);
            const payload = Object.fromEntries(formData.entries());

            if (!formData.get("email") || !formData.get("password")) {
                setSubmitClicked(false);
                return;
            }

            const response = await axios.post("http://localhost:4000/api/users/log-in",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );

            if (response.status == 200) {
                toast.success("You are logged In!");
                const token = response.data.data.token;
                const user = response.data.data.user
                console.log("RESPONSE:::::::::::: ", response.data.data.user);
                localStorage.setItem("token", token)
                dispatch(setToken(token));
                dispatch(setUser(user));
                navigate("/");
                return;
            }

        } catch (error) {
            if (error instanceof AxiosError) {   
                const message = error?.response?.data?.message ?? "Internal server error!";
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
                        Welcome back,
                        </span>
                            <span className="inline-block text-purple-500">
                                {role === "user" ? "User!" : "Seller!"}
                            </span>
                        <br />
                        <span className="text-purple-500">Log in</span>
                        <span className="text-3xl">
                        &nbsp;to access your account and enjoy
                        <br />
                        seamless E-Commerce experience
                        </span>
                    </p>

                    <p className="text-xl text-gray-700 font-medium">
                        Don't have an account?
                        <Link to="/sign-up">
                            <span className="text-gray-900 font-bold underline"> Sign Up </span>
                        </Link>
                    </p>

                </aside>

                <aside className='w-1/2 h-screen flex justify-center items-center'>
                    <form className='bg-white relative mx-auto h-fit mt-12 w-3/5 px-10 pt-4 pb-8 rounded-xl shadow-md shadow-gray-300' onSubmit={(e) => logIn(e)}>
                        <fieldset>
                            <div className='w-full relative'>
                                <button className={`${role === "user" ? "text-gray-900" : "text-gray-500"} rounded-t-md w-1/2 py-3 font-medium`} onClick={(e) => changeLogInType(e, "user")}>
                                    User
                                </button>

                                <button className={`${role === "captain" ? "text-gray-900" : "text-gray-500"} rounded-t-md w-1/2 py-3 font-medium`} onClick={(e) => changeLogInType(e, "captain")}>
                                    Seller
                                </button>

                                <div className={`w-1/2 h-[3px] bg-gray-900 rounded-md ${role == "user" ? "translate-x-0" : "translate-x-full"} transition-all duration-200`} />
                            </div>

                            <div className='my-6'>
                                <p className='text-center font-bold text-2xl text-gray-900'>Login to Account</p>
                                <p className='text-center text-xs text-gray-500 my-2'>Please enter your email and password to continue</p>
                            </div>

                            <div className='text-left'>
                                <label className='text-sm text-gray-500 font-semibold' htmlFor='email'>Email address </label>
                                <br />
                                <input type='text' placeholder='youremail@gmail.com' name='email' className='h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none' autoFocus />
                                <br /><br />

                                <label className='text-sm text-gray-500 font-semibold' htmlFor='password'>Password </label>
                                <br />
                                <input type='password' placeholder='......' name='password' className='h-12 mt-2 px-3 w-full placeholder:text-7xl border-2 border-gray-200 rounded-md outline-none' />

                                <div className='text-center mt-8'>
                                    <input type='submit' className={`w-full cursor-pointer ${submitClicked ? "bg-purple-400" : "bg-purple-500"} rounded-lg py-3 text-white font-semibold`} value={submitClicked ? "Signing In..." : "Sign In"} />
                                </div>

                            </div>

                        </fieldset>
                    </form>
                </aside>
            </section>
        </>
    )
}