"use client";

import { useState } from "react";
import AdminHeader from "@/components/Admin/AdminHeader";
import ManageSellers from "@/components/Admin/ManageSellers";
import ManageProducts from "@/components/Admin/ManageProducts";
import ManageCategories from "@/components/Admin/ManageCategories";
import ManageOrders from "@/components/Admin/ManageOrders";
import ManageAdmins from "@/components/Admin/ManageAdmins";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "sellers":
        return <ManageSellers />;
      case "products":
        return <ManageProducts />;
      case "categories":
        return <ManageCategories />;
      case "orders":
        return <ManageOrders />;
      case "admins":
        return <ManageAdmins />;
      default:
        return <div className="p-4">Welcome to the Admin Dashboard</div>;
    }
  };

  return (
    <div>
      <AdminHeader onChangeView={setCurrentView} />
      {renderView()}
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import EditAdminForm from "@/components/Admin/EditAdminForm"; // Import the EditAdminForm

// export default function AdminDashboard() {
//   const [admins, setAdmins] = useState([]);
//   const [currentAdmin, setCurrentAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingAdmin, setEditingAdmin] = useState(null); // State for editing admin
//   const router = useRouter();

//   // delete admin
//   const handleDeleteAdmin = async (adminId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
//     if (!confirmDelete) return;
  
//     try {
//       await axios.delete(`/api/admin/admins/${adminId}`);
//       setAdmins((prev) => prev.filter((a) => a._id !== adminId));
//     } catch (err) {
//       alert("Failed to delete admin.");
//       console.error(err);
//     }
//   };

//   // ✅ Fetch logged-in admin info first
//   useEffect(() => {
//     async function fetchCurrentAdmin() {
//       try {
//         const { data } = await axios.get("/api/admin/auth/me");
//         if (data.success) {
//           setCurrentAdmin(data.user);
//         } else {
//           router.push("/Admin/Login");
//         }
//       } catch (err) {
//         router.push("/Admin/Login"); // ❌ Not logged in or invalid token
//       } finally {
//         setAuthLoading(false);
//       }
//     }
//     fetchCurrentAdmin();
//   }, []);

//   // ✅ Fetch all admins once current admin is confirmed
//   useEffect(() => {
//     async function fetchAdmins() {
//       try {
//         const { data } = await axios.get("/api/admin/admins");
//         setAdmins(data);
//       } catch (err) {
//         setError("Failed to fetch admins");
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (currentAdmin?.role === "superadmin") {
//       fetchAdmins();
//     }
//   }, [currentAdmin]);

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // or clear cookies if used
//     router.push("/Admin/Login");
//   };

//   if (authLoading) {
//     return <div className="p-10 text-center text-gray-500">Authenticating...</div>;
//   }

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-800 text-white p-6">
//         <h2 className="text-2xl mb-4">Admin Dashboard</h2>
//         <div className="mb-6">
//           <p className="font-semibold">{currentAdmin?.name}</p>
//           <p className="text-sm text-gray-300">{currentAdmin?.email}</p>
//           <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${currentAdmin?.role === 'superadmin' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
//             {currentAdmin?.role}
//           </span>
//         </div>
//         <ul>
//           {/* ✅ Show only if superadmin */}
//           {currentAdmin?.role === "superadmin" && (
//             <li>
//               <button className="w-full text-left" onClick={() => router.push("/Admin/Add-Admin")}>
//                 Add Admin
//               </button>
//             </li>
//           )}
//           <li>
//             <button className="w-full text-left" onClick={() => router.push("/Admin/manage-categories")}>
//               Manage Categories
//             </button>
//           </li>
//           <li>
//             <button className="w-full text-left" onClick={() => router.push("/Admin/manage-products")}>
//               Manage Products
//             </button>
//           </li>
//           <li>
//             <button className="w-full text-left text-red-400 mt-4" onClick={handleLogout}>
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>

//       {/* ✅ Main Content (only for superadmin) */}
//       <div className="w-3/4 p-6 bg-gray-100">
//         {currentAdmin?.role === "superadmin" && (
//           <>
//             <h2 className="text-xl font-bold mb-4">Admin List</h2>
//             {loading && <p>Loading admins...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             <ul>
//               {admins.map((admin) => (
//                 <li key={admin._id} className="flex justify-between items-center border-b py-2">
//                   <div>
//                     <p className="font-medium">{admin.name}</p>
//                     <p className="text-sm text-gray-600">{admin.email}</p>
//                     <span className="text-xs px-2 py-1 rounded bg-gray-200">
//                       {admin.role}
//                     </span>
//                   </div>

//                   {/* ✅ Actions (hide self-actions) */}
//                   {admin._id !== currentAdmin._id && (
//                     <div className="flex gap-2">
//                       <button
//                         className="text-blue-600 hover:underline"
//                         onClick={() => setEditingAdmin(admin)} // Open the edit form with the selected admin
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="text-red-600 hover:underline"
//                         onClick={() => handleDeleteAdmin(admin._id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>

//       {/* Conditionally render the EditAdminForm */}
//       {editingAdmin && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <EditAdminForm
//               admin={editingAdmin}
//               onSave={() => {
//                 setEditingAdmin(null); // Close the form after saving
//               }}
//               onCancel={() => {
//                 setEditingAdmin(null); // Close the form when cancel is clicked
//               }}
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
