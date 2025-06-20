'use client'
import './style.css'
export default function Customer(){
    return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4 bg-[#E3F4F6]">
            <div className="row-span-2 col-span-2 rounded-lg bg-[#F5F5F5]"></div>
            <div className="rounded-lg bg-[#F5F5F5]"></div>
            <div className="rounded-lg bg-[#F5F5F5]"></div>
        </div>
    )
}