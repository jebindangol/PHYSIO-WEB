import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Logo from "../../../public/physionlogo.png"
import { MdRemoveRedEye } from "react-icons/md"; 
import { doLogin } from "../../services/apiContract";
import { useRouter } from "next/router";

const Login = () => {
    const {
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const response = await doLogin(data);
            console.log("Login successful:", response);
            if (response.ok) {
                router.push("/admin");
            } 
            else {
                console.error("Login failed:", response.data.message);
            }
            } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const [isUserIdFocused, setIsUserIdFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleUserIdFocus = () => {
        setIsUserIdFocused(true);
    };
    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
    };

    return (
        <div className="h-screen flex justify-center items-center gap-14 bg-tableColor">
            <div className="flex flex-row items-center gap-20 bg-white w-[800px] h-[400px] shadow-md rounded-xl z-10 px-10">
                <div className="py-11">
                    <Link href="./">
                        <Image 
                            src={Logo} 
                            alt="logo" 
                            width={300}
                            height={200}
                        />
                    </Link>
                </div>
                <div >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <div>
                            <input 
                                type="email" 
                                {...register("email")}
                                placeholder="Email"
                                className= {`border-b-2 w-64 p-2 outline-none ${
                                    isUserIdFocused ? "border-b-2 border-black" : "border-b-2 border-gray-300 "
                                }` }
                                onFocus={handleUserIdFocus}
                            />
                            {errors.userId && (
                                <p className="text-red-500 text-[12px]">{errors.userId.message}</p>
                            )}
                        </div>
                        <div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Password"
                                className= {`w-64 p-2 absolute outline-none ${
                                    isPasswordFocused ? "border-b-2 border-black" : "border-b-2 border-gray-300 "
                                }` }
                                onFocus={handlePasswordFocus}
                            />
                            <div
                            className="eye-icon relative flex justify-end top-5 cursor-pointer"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseOut={() => setShowPassword(false)}
                            >
                                <MdRemoveRedEye size={20} style={{color: 'grey'}} />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-[12px]">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <Link href="./" className="text-gray-300 font-light text-sm flex justify-end mt-5" >
                                Forgot Password?
                            </Link>
                        </div>
                        <div>
                            <button 
                                type="submit"
                                className="w-64 bg-blue h-10 rounded-md"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Login;
