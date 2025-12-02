import { useEffect, useState } from "react";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { Pencil, Trash } from "lucide-react";
import { User } from "@/models/User";

function AdminUsers() {
const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.getUsers);

      if (res.data?.success === true) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Aktif Olmayan Kullanıcılar</h2>

      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Actions</th>
            <th className="p-3 border">First Name</th>
            <th className="p-3 border">Last Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-3 border flex justify-center gap-3">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil size={18} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </td>

              <td className="p-3 border">{user.firstName}</td>
              <td className="p-3 border">{user.lastName}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.phoneNumber}</td>
              <td className="p-3 border">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
