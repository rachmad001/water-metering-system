'use client'

import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import { Karla } from "next/font/google";
import { useRouter } from 'next/router'
import { encrypt } from '@/app/lib/session'
import { serialize } from 'cookie'

const karla = Karla({
  subsets: ['latin']
})
export default function login() {
    const [forms, setMyForms] = useState({
        username: '',
        password: ''
    });

    const [visible, setVisible] = useState(false)

    const loginAct = () => {
        var formData = new FormData();
        formData.append("email", forms.username);
        formData.append("password", forms.password);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", process.env.NEXT_PUBLIC_API_URL + "/login");
        xhr.onload = function() {
            var data = JSON.parse(this.responseText);
            if(data.status){
                Swal.fire({
                    icon: "success",
                    title: "Login successfull",
                    text: `welcome ${data.data[0].nama}`,
                    timer: 2000,
                    showConfirmButton: false
                  }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                      window.location.href = "/";
                    }
                  });                  
            }else {
                Swal.fire({
                    icon: "error",
                    title: "Login Fail",
                    text: "Email or password incorrect",
                    timer: 2000,
                    showConfirmButton: false
                  }).then((result) => {
                  }); 
            }
        }
        xhr.send(formData)
    }
    return (
        <div className="h-dvh grid md:grid-cols-2 bg-[#E3F4F6] sm:grid-cols-1 text-black">
            <div className="border-1 border-[yellow] relative sm:hidden md:block">
                <img
                    src="/animate/water.png"
                    alt=""
                    className="w-[70%] h-[70%] fixed bottom-0 left-[-20%]"
                />
            </div>
            <div className="border-1 border-[red] flex justify-center items-center">
                <div className="border-2 border-red-300 w-90">
                    <h2 className={` ${karla.className} w-fit p-0 m-auto font-bold text-black text-lg text-[#4F4C4C]`}>User Login</h2>
                    <div className="p-1 mt-3 flex items-center w-[300px] rounded-full bg-[#D9D9D9] mx-auto">
                        <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="#969090" strokeWidth="1.8" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <div className="grow">
                            <input
                                type="text"
                                placeholder="Username"
                                className="placeholder:text-[#969090] text-black outline-[0px] w-[calc(100%-30px)] px-2"
                                onChange={e => {
                                    setMyForms(prevData => ({
                                        ...prevData,
                                        username: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-1 mt-3 flex items-center w-[300px] rounded-full bg-[#D9D9D9] mx-auto">
                        <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="#969090" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
                        </svg>

                        <div className="grow">
                            <input
                                type={visible ? 'text' : 'password'}
                                placeholder="Password"
                                className="placeholder:text-[#969090] text-black outline-[0px] w-[100%] px-2"
                                onChange={e => {
                                    setMyForms(prevData => ({
                                        ...prevData,
                                        password: e.target.value
                                    }))
                                }}
                            />
                        </div>
                        {visible ? (
                            <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
                                onClick={() => setVisible(!visible)}>
                                <path stroke="#969090" strokeLinecap="round" strokeLinejoin="round" stroke-width="1.8" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        ) : (
                            <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
                                onClick={() => setVisible(!visible)}>
                                <path stroke="#969090" strokeWidth="1.8" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                <path stroke="#969090" strokeWidth="1.8" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </div>
                    <button type="button" className="block mt-3 rounded-full bg-[#066979] text-center text-[#F5F5F5] w-[300px] mx-auto p-1" onClick={loginAct}>Login</button>
                    
                </div>
            </div>
        </div>

    )
}