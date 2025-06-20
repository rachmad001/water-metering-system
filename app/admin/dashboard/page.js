'use client'
import './style.css'
import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';

const Sidebar = ({ menu }) => (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>
        <nav className="flex-grow p-4">
            <ul className="space-y-2">
                <li>
                    <a href="/admin/dashboard" className={`block px-4 py-2 rounded transition-colors duration-200 ${menu == "1" ? "bg-gray-700" : ""} hover:bg-gray-600`}>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="/admin/customer" className={`block px-4 py-2 rounded transition-colors duration-200 ${menu == "2" ? "bg-gray-700" : ""} hover:bg-gray-700`}>
                        Customer
                    </a>
                </li>
                <li>
                    <a href="/admin/devices" className={`block px-4 py-2 rounded transition-colors duration-200 ${menu == "3" ? "bg-gray-700" : ""} hover:bg-gray-700`}>
                        Devices
                    </a>
                </li>
            </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">© 2025 Your Company</p>
        </div>
    </div>
);

const EditModal = ({ row, onClose, onSave }) => {
    const [editedValue, setEditedValue] = useState('');
    const [editedStatus, setEditedStatus] = useState(false);

    useEffect(() => {
        if (row) {
            setEditedValue(row.value);
            setEditedStatus(row.is_paid);
        }
    }, [row]);

    const handleSave = (e) => {
        e.preventDefault();
        onSave(row.id , editedValue, editedStatus);
    };

    if (!row) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(190,190,190,0.3)] flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">Edit Entry: {row.userId}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <input id="value" type="text" value={editedValue} onChange={(e) => setEditedValue(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" value={String(editedStatus)} onChange={(e) => setEditedStatus(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="1">Paid</option>
                            <option value="0">Unpaid</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function App() {
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
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/data/dashboard?page=${pages}&per_page=${perPages}${order}${searchs}`;

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

    //proses ke api untuk update data
    const handleEdit = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedRow(null);
    };

    const handleSave = (id, value, status) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            var response = JSON.parse(this.responseText);
            if(response.status){
                loadDataTable();
                Swal.fire({
                    icon: "success",
                    title: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
            }else {
                Swal.fire({
                    icon: "error",
                    title: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
            }
        }

        var data = new URLSearchParams();
        data.append("id", id);
        data.append("value", value);
        data.append("status", status);

        xhr.open("PUT", process.env.NEXT_PUBLIC_API_URL + "/admin/data", true);
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("token"));
        xhr.send(data);
        
        handleCloseEditModal();
    };

    const date_format = (dates) => {
        var tanggal = new Date(dates);

        return tanggal.getFullYear() + "-" + tanggal.getMonth() + "-" + tanggal.getDate();
    }

    const GetBill = ({ tokenDevice }) => {
        const [bill, setBill] = useState('Loading...');

        const getTotalBill = () => {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var response = JSON.parse(this.responseText);
                if(response.status){
                    setBill(response.data);
                }
            }
            xhr.open("GET", process.env.NEXT_PUBLIC_API_URL + "/bill/" + tokenDevice, true);
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
        <div className='flex flex-row h-full bg-gray-10 font-sans'>
            <Sidebar menu="1" />
            <div className="grow flex justify-center items-center py-3">
                <div className="flex flex-col rounded-xl bg-white w-[90%] h-auto max-h-full overflow-y-scroll scrollbar-hide border-2 border-[#C0ECF4]">
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('nik')}>
                                        User ID {getSortIndicator('nik')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('device')}>
                                        Device ID {getSortIndicator('device')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('value')}>
                                        Value {getSortIndicator('value')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                        Bill
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('created_at')}>
                                        Date {getSortIndicator('created_at')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {initialData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.device.nik}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.device.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><GetBill tokenDevice={row.device.token}/></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row.is_paid ? 'Paid' : 'Unpaid'}</span></td>
                                        <td className="px-6 py-4 "><img src={process.env.NEXT_PUBLIC_ASSET_URL+row.images_source} alt={`Image for ${row.id}`} className="w-[100px] h-[100px] object-contain shadow-sm" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{date_format(row.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(row)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        </td>
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
                                    page = page-1;
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
                                    page = page+1;
                                    setPages(page)
                                }}
                                disabled={currentPages === totalPages}
                                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >Next</button>
                            {/* <button className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Next</button> */}
                        </div>
                    </div>
                </div>
                {/* <div className='w-[50px] h-[50px] border-3 border-indigo-300'></div> */}
            </div>
            {isEditModalOpen && <EditModal row={selectedRow} onClose={handleCloseEditModal} onSave={handleSave} />}
        </div>

    )
}