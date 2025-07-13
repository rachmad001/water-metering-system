'use client'
import './style.css'
import { useState, useEffect, useMemo } from 'react';

export default function Customer() {
    const [profile, setProfile] = useState()

    useEffect(() => {
        const val = JSON.parse(sessionStorage.getItem("profile"));
        setProfile(val)
    }, [])

    const [initialData, setInitialData] = useState([]);

    const [sortConfig, setSortConfig] = useState({ key: 'nik', direction: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [perPages, setPerPages] = useState(10)
    const [pages, setPages] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [total, setTotal] = useState(0);
    const [currentPages, setCurrentPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState(null);

    useEffect(() => {
        loadDataTable()
    }, [])

    useEffect(() => {
        loadDataTable()
    }, [pages, perPages, search, sortConfig])

    const loadDataTable = async () => {
        const token = sessionStorage.getItem("token");
        try {
            // Construct the API URL
            const searchs = search != null ? "&search=" + search : "";
            const order = `&order=${sortConfig.key}&type_order=${sortConfig.direction}`
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/data-dashboard-customer?page=${pages}&per_page=${perPages}${order}${searchs}`;

            // Make the fetch request with Authorization header
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response
            const responses = await response.json();
            console.log(responses);
            setCurrentPages(responses.current_page)
            setTotalPages(responses.last_page)
            setPages(responses.current_page)
            setFrom(responses.from)
            setTo(responses.to)
            setTotal(responses.total)

            setInitialData(responses.data)

        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log("An unknown error occurred.");
            }
            console.error("Failed to fetch data:", e);
        }
    }

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) {
            return ' ◇'; // Default icon (diamond) for non-active sort columns
        }
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const date_format = (dates) => {
        var tanggal = new Date(dates);

        return tanggal.getFullYear() + "-" + tanggal.getMonth() + "-" + tanggal.getDate();
    }

    const GetBill = ({ tokenDevice, id }) => {
        const [bill, setBill] = useState('Loading...');

        const getTotalBill = () => {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                if (response.status) {
                    var total = new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                    }).format(response.data.total);
                    setBill(total);
                }
            }
            xhr.open("GET", process.env.NEXT_PUBLIC_API_URL + "/bill/" + tokenDevice + "/" + id, true);
            xhr.send();
        }

        useEffect(() => {
            getTotalBill();
        }, [])

        return (
            <span>{bill}</span>
        )
    }
    return (
        <div className="w-full h-full flex items-center justify-center  grid-rows-2 gap-4 bg-[#E3F4F6]">
            <div className="flex flex-col w-[70%] h-full">
                <div className="col-span-2 rounded-lg flex flex-col text-[#066979] bg-[#FFFFFF] p-3">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">CUSTOMER PROFILE</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentcolor" className="size-6 hover:cursor-pointer">
                            <path strokeLinecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                <td><span className="font-semibold">NIK:</span> {profile?.nik}</td>
                                <td><span className="font-semibold">NAME:</span> {profile?.nama}</td>
                                <td><span className="font-semibold">BIRTH DATE:</span> {profile?.tanggal_lahir}</td>
                            </tr>
                            <tr>
                                <td><span className="font-semibold">PHONE NUMBER:</span> {profile?.no_hp}</td>
                                <td><span className="font-semibold">EMAIL:</span> {profile?.email}</td>
                                <td><span className="font-semibold">ADDRESS:</span> {profile?.alamat}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className=" mt-3 flex flex-col rounded-xl bg-white h-auto max-h-full overflow-y-scroll scrollbar-hide border-2 border-[#C0ECF4]">
                    <div className="flex w-full justify-between items-center p-3">
                        <h1 className="text-4xl font-bold text-gray-800">User Payments</h1>

                        <div className="flex items-center flex-row">
                            <input
                                type="text"
                                placeholder="Search by User ID or Value..."
                                className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500 text-gray-800"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 text-gray-800 ms-2">
                                <label htmlFor="rows">Rows:</label>
                                <select
                                    className="placeholder:text-gray-500 text-gray-800"
                                    id='rows'
                                    value={perPages}
                                    onChange={(e) => setPerPages(e.target.value)}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('device')}>
                                        Device ID {getSortIndicator('device')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('created_at')}>
                                        Date {getSortIndicator('created_at')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('value')}>
                                        Value {getSortIndicator('value')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                        Bill
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {initialData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.device.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{date_format(row.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><GetBill tokenDevice={row.device.token} id={row.id} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row.is_paid ? 'Paid' : 'Unpaid'}</span></td>
                                        <td className="px-6 py-4 "><img src={process.env.NEXT_PUBLIC_ASSET_URL + row.images_source} alt={`Image for ${row.id}`} className="w-[200px] h-[130px] shadow-sm" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center p-2">
                        <p className="text-sm text-gray-600">
                            Showing {from} to {to} of {total} entries
                        </p>
                        <div className="flex items-center space-x-2 text-gray-600">
                            {/* <button className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Previous</button> */}
                            <button
                                onClick={() => {
                                    var page = pages;
                                    page = page - 1;
                                    setPages(page)
                                }}
                                disabled={currentPages === 1}
                                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm px-2">Page {currentPages} of {totalPages}</span>
                            <button
                                onClick={() => {
                                    var page = pages;
                                    page = page + 1;
                                    setPages(page)
                                }}
                                disabled={currentPages === totalPages}
                                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >Next</button>
                            {/* <button className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Next</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}