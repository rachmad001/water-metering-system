'use client'
import { Karla } from "next/font/google";
import React, { useState } from 'react';
import Swal from "sweetalert2";

const karla = Karla({
    subsets: ["latin"]
})

const EyeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
);


const EyeSlashIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2.91858 6.60465C2.70062 6.09784 2.11327 5.86324 1.60603 6.08063C1.0984 6.29818 0.863613 6.8869 1.08117 7.39453L1.0816 7.39553L1.08267 7.39802L1.08566 7.4049L1.09505 7.42618C1.10282 7.44366 1.11363 7.46765 1.12752 7.49772C1.15529 7.55783 1.19539 7.64235 1.2481 7.74777C1.35345 7.95845 1.5096 8.25357 1.71879 8.605C2.12772 9.29201 2.74529 10.2043 3.59029 11.1241L2.79285 11.9215C2.40232 12.312 2.40232 12.9452 2.79285 13.3357C3.18337 13.7262 3.81654 13.7262 4.20706 13.3357L5.04746 12.4953C5.61245 12.9515 6.24405 13.3814 6.94417 13.7519L6.16177 14.9544C5.86056 15.4173 5.99165 16.0367 6.45457 16.338C6.91748 16.6392 7.53693 16.5081 7.83814 16.0452L8.82334 14.531C9.50014 14.7386 10.2253 14.8864 11 14.9556V16.4998C11 17.0521 11.4477 17.4998 12 17.4998V12.9998C9.25227 12.9998 7.18102 11.8012 5.69633 10.4109C5.68823 10.4031 5.68003 10.3954 5.67173 10.3878C5.47324 10.2009 5.28532 10.0105 5.10775 9.81932C4.35439 9.00801 3.80137 8.19355 3.43737 7.58204C3.25594 7.27722 3.12302 7.02546 3.03696 6.85334C2.99397 6.76735 2.96278 6.70147 2.94319 6.65905C2.93339 6.63785 2.92651 6.62253 2.9225 6.61352L2.91858 6.60465ZM1.08117 7.39453L1.99995 6.99977C1.08081 7.39369 1.08117 7.39453 1.08117 7.39453Z" fill="#1C274C"></path> <path opacity="0.5" d="M15.2209 12.3984C14.2784 12.7694 13.209 13.0002 12 13.0002V17.5002C12.5523 17.5002 13 17.0525 13 16.5002V14.9559C13.772 14.8867 14.4974 14.7392 15.1764 14.5311L16.1618 16.0456C16.463 16.5085 17.0825 16.6396 17.5454 16.3384C18.0083 16.0372 18.1394 15.4177 17.8382 14.9548L17.0558 13.7524C17.757 13.3816 18.3885 12.9517 18.9527 12.496L19.7929 13.3361C20.1834 13.7267 20.8166 13.7267 21.2071 13.3361C21.5976 12.9456 21.5976 12.3124 21.2071 11.9219L20.4097 11.1245C21.1521 10.3164 21.7181 9.51502 22.1207 8.86887C22.384 8.44627 22.5799 8.08609 22.7116 7.82793C22.7775 7.69874 22.8274 7.59476 22.8619 7.5209C22.8791 7.48397 22.8924 7.45453 22.902 7.4332L22.9134 7.40736L22.917 7.39913L22.9191 7.39411C23.1367 6.88648 22.9015 6.2986 22.3939 6.08105C21.8864 5.86355 21.2985 6.09892 21.0809 6.60627L21.0759 6.61747C21.0706 6.62926 21.0617 6.6489 21.0492 6.6758C21.0241 6.72962 20.9844 6.81235 20.9299 6.91928C20.8207 7.13337 20.6526 7.4431 20.4233 7.81119C19.9628 8.55023 19.2652 9.50857 18.3156 10.3999C17.4746 11.1893 16.4469 11.9158 15.2209 12.3984Z" fill="#1C274C"></path> </g></svg>
);

export default function Home() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const login = () => {
        console.log("api_url:", process.env.NEXT_PUBLIC_API_URL);

        var formdata = new FormData();
        formdata.append("email", formData.username);
        formdata.append("password", formData.password);

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);

            if (response.status) {
                Swal.fire({
                    title: "Status login",
                    text: "Berhasil login",
                    icon: "success",
                }).then((result) => {
                    if(result.isConfirmed){
                        sessionStorage.setItem("token", response.data[0].token)
                        window.location.href = '/admin/dashboard'
                    }
                });
            }else {
                Swal.fire({
                    title: "Status login",
                    text: "Login gagal. pastikan email atau password telah benar",
                    icon: "error",
                })
            }
        }

        xhr.open("POST", process.env.NEXT_PUBLIC_API_URL + "/admin/login", true);
        xhr.send(formdata);
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[url(/bg-login.png)]">
            <div className="w-[300px] min-w-[250px] p-3 bg-cyan-500/50 rounded-lg">
                <h3 className={`${karla.className} text-xl font-semibold text-center text-[#066979]`}>Login</h3>
                {/* <!-- Username Input Group --> */}
                <div className="relative mt-2">
                    {/* <!-- Icon Wrapper --> */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="z-1 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M20.4141 18.5H18.9999M18.9999 18.5H17.5857M18.9999 18.5L18.9999 17.0858M18.9999 18.5L18.9999 19.9142" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 13C14.6083 13 16.8834 13.8152 18.0877 15.024M15.5841 20.4366C14.5358 20.7944 13.3099 21 12 21C8.13401 21 5 19.2091 5 17C5 15.6407 6.18652 14.4398 8 13.717" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    </div>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block w-full px-12 py-3 text-gray-900 bg-white/70 backdrop-blur-sm border-none rounded-full placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-sky-400"
                        placeholder="Username"
                    />

                </div>

                <div className="relative mt-2">
                    {/* <!-- Lock Icon Wrapper --> */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {/* <!-- Lock Icon SVG --> */}
                        <svg className="z-1 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full px-12 py-3 text-gray-900 bg-white/70 backdrop-blur-sm border-none rounded-full placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-sky-400"
                        placeholder="Password"
                    />
                    {/* <!-- Visibility Toggle Button --> */}
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-4" onClick={togglePasswordVisibility}>
                        {/* <!-- Eye Slash Icon SVG --> */}
                        {showPassword ? (
                            <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        ) : (
                            <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    className="mt-8 w-full py-2 px-6 
                   bg-[#046A7A66] text-white font-semibold text-lg rounded-full 
                   hover:bg-[#6D8F96] 
                   active:bg-[#5E7C82]
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7E9DA3]
                   transition-colors duration-200"
                    onClick={login}
                >
                    LOGIN
                </button>
            </div>
        </div>
    );
}