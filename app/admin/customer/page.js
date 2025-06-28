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
                <li>
                    <a href="/admin/pricing" className={`block px-4 py-2 rounded transition-colors duration-200 ${menu == "4" ? "bg-gray-700" : ""} hover:bg-gray-700`}>
                        Pricing
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
    const [editedNama, setEditedNama] = useState('');
    const [editedBirthDate, setEditedBirthDate] = useState('');
    const [editedAlamat, setEditedAlamat] = useState('');
    const [editedNoHp, setEditedNoHp] = useState('');
    const [editedPassword, setEditedPassword] = useState('');

    useEffect(() => {
        if (row) {
            setEditedNama(row.nama);
            setEditedBirthDate(row.tanggal_lahir);
            setEditedAlamat(row.alamat);
            setEditedNoHp(row.no_hp);
        }
    }, [row]);

    const handleSave = (e) => {
        e.preventDefault();
        onSave({ ...row, nama: editedNama, tanggal_lahir: editedBirthDate, alamat: editedAlamat, no_hp: editedNoHp, password: editedPassword });
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
                        <label htmlFor="edit_nama" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input id="edit_nama" type="text" value={editedNama} onChange={(e) => setEditedNama(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                        <input id="edit_tanggal_lahir" type="text" value={editedBirthDate} onChange={(e) => setEditedBirthDate(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_alamat" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input id="edit_alamat" type="text" value={editedAlamat} onChange={(e) => setEditedAlamat(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_no_hp" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input id="edit_no_hp" type="text" value={editedNoHp} onChange={(e) => setEditedNoHp(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input id="edit_password" type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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

const AddModal = ({ onClose, onSave }) => {
    const [editedNik, setEditedNik] = useState('');
    const [editedNama, setEditedNama] = useState('');
    const [editedBirthDate, setEditedBirthDate] = useState('');
    const [editedAlamat, setEditedAlamat] = useState('');
    const [editedNoHp, setEditedNoHp] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedPassword, setEditedPassword] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        onSave({ nik: editedNik, nama: editedNama, tanggal_lahir: editedBirthDate, alamat: editedAlamat, no_hp: editedNoHp, email: editedEmail, password: editedPassword });
    };

    return (
        <div className="fixed inset-0 bg-[rgba(190,190,190,0.5)] flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full h-auto max-h-full max-w-md overflow-y-scroll">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">Register Entry:</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label htmlFor="edit_nik" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <input id="edit_nik" type="text" value={editedNik} onChange={(e) => setEditedNik(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_nama" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input id="edit_nama" type="text" value={editedNama} onChange={(e) => setEditedNama(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                        <input id="edit_tanggal_lahir" type="date" value={editedBirthDate} onChange={(e) => setEditedBirthDate(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_alamat" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input id="edit_alamat" type="text" value={editedAlamat} onChange={(e) => setEditedAlamat(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_no_hp" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input id="edit_no_hp" type="text" value={editedNoHp} onChange={(e) => setEditedNoHp(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input id="edit_email" type="text" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input id="edit_password" type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
// const AddModal = ({ onClose, onSave }) => {
//     const [editedNik, setEditedNik] = useState('');
//     const [editedNama, setEditedNama] = useState('');
//     const [editedAlamat, setEditedAlamat] = useState('');

//     const handleSave = (e) => {
//         e.preventDefault();
//         onSave({ nik: editedNik, nama: editedNama, tanggal_lahir: editedBirthDate, alamat: editedAlamat, no_hp: editedNoHp, email: editedEmail, password: editedPassword });
//     };

//     return (
//         <div className="fixed inset-0 bg-[rgba(190,190,190,0.5)] flex justify-center items-center z-50">
//             <div className="bg-white p-8 rounded-lg shadow-2xl w-full h-auto max-h-full max-w-md overflow-y-scroll">
//                 <div className="flex justify-between items-center border-b pb-4 mb-4">
//                     <h3 className="text-2xl font-semibold text-gray-800">Register Entry:</h3>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
//                 </div>
//                 <form onSubmit={handleSave}>
//                     <div className="mb-4">
//                         <label htmlFor="edit_nik" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
//                         <input id="edit_nik" type="text" value={editedNik} onChange={(e) => setEditedNik(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_nama" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                         <input id="edit_nama" type="text" value={editedNama} onChange={(e) => setEditedNama(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
//                         <input id="edit_tanggal_lahir" type="date" value={editedBirthDate} onChange={(e) => setEditedBirthDate(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_alamat" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                         <input id="edit_alamat" type="text" value={editedAlamat} onChange={(e) => setEditedAlamat(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_no_hp" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                         <input id="edit_no_hp" type="text" value={editedNoHp} onChange={(e) => setEditedNoHp(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
//                         <input id="edit_email" type="text" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                         <input id="edit_password" type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} className="text-gray-800 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                         <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
//                         <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Changes</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

export default function App() {
    const [initialData, setInitialData] = useState([]);

    const [sortConfig, setSortConfig] = useState({ key: 'nik', direction: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/pelanggan?page=${pages}&per_page=${perPages}${order}${searchs}`;

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

    const handleAdd = () => {
        setIsAddModalOpen(true)
    }

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedRow(null);
    };

    const handleSaveAdd = (row) => {
        Swal.fire({
            title: 'Saving...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        var formData = new FormData();
        formData.append("nik", row.nik);
        formData.append("nama", row.nama);
        formData.append("tanggal_lahir", row.tanggal_lahir);
        formData.append("alamat", row.alamat);
        formData.append("no_hp", row.no_hp);
        formData.append("email", row.email);
        formData.append("password", row.password);

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);
            if (response.status) {
                loadDataTable();
                Swal.fire({
                    icon: "success",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 2000
                });
                handleCloseAddModal()
            } else {
                Swal.fire({
                    icon: "error",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 2000
                });
            }

        }
        xhr.open("POST", process.env.NEXT_PUBLIC_API_URL + "/admin/pelanggan/regist", true);
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"));
        xhr.send(formData);
    }

    const handleSave = (row) => {
        Swal.fire({
            title: 'Saving...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        var formData = new URLSearchParams();
        formData.append("nik", row.nik);
        formData.append("nama", row.nama);
        formData.append("tanggal_lahir", row.tanggal_lahir);
        formData.append("alamat", row.alamat);
        formData.append("no_hp", row.no_hp);
        formData.append("email", row.email);
        if(row.password != ''){
            formData.append("password", row.password)
        };

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);
            if (response.status) {
                loadDataTable();
                Swal.fire({
                    icon: "success",
                    title: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
            }
        }
        
        xhr.open("PUT", process.env.NEXT_PUBLIC_API_URL + "/admin/pelanggan", true);
        xhr.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem("token"));
        xhr.send(formData);
        handleCloseEditModal();
    };

    const date_format = (dates) => {
        var tanggal = new Date(dates);

        return tanggal.getFullYear() + "-" + tanggal.getMonth() + "-" + tanggal.getDate();
    }

    return (
        <div className='flex flex-row h-full bg-gray-10 font-sans'>
            <Sidebar menu="2" />
            <div className="grow flex justify-center items-center py-3">
                <div className="flex flex-col rounded-xl bg-white w-[90%] h-auto max-h-full overflow-y-scroll scrollbar-hide border-2 border-[#C0ECF4]">
                    <div className="flex w-full justify-between items-center p-3">
                        <h1 className="text-4xl font-bold text-gray-800">User Profile</h1>

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
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded ms-2" onClick={handleAdd}>
                                Tambah
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('nik')}>
                                        User ID {getSortIndicator('nik')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('nama')}>
                                        Name {getSortIndicator('nama')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('tanggal_lahir')}>
                                        Birthdate {getSortIndicator('tanggal_lahir')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('no_hp')}>
                                        Phone {getSortIndicator('no_hp')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('email')}>
                                        E-mail {getSortIndicator('email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('created_at')}>
                                        Register {getSortIndicator('created_at')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {initialData.map((row) => (
                                    <tr key={row.nik} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nik}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.tanggal_lahir}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.alamat}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.no_hp}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.email}</td>
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
                {/* <div className='w-[50px] h-[50px] border-3 border-indigo-300'></div> */}
            </div>
            {isEditModalOpen && <EditModal row={selectedRow} onClose={handleCloseEditModal} onSave={handleSave} />}
            {isAddModalOpen && <AddModal onClose={handleCloseAddModal} onSave={handleSaveAdd} />}
        </div>

    )
}