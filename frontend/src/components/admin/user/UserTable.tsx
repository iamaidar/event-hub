import { User } from "../../../api/userApi";
import { Link } from "react-router-dom";

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
      <table className="min-w-full text-gray-900">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Avatar",
              "Username",
              "Email",
              "Firstname",
              "Lastname",
              "Gender",
              "Age",
              "Role",
              "Is Active",
              "Is Social Active",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => {
            return (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 flex justify-center">
                  {user.avatar_base64 ? (
                    <img
                      src={user.avatar_base64}
                      alt={user.username}
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/50"
                      alt="Placeholder"
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  )}
                </td>
                <td className="px-6 py-4 text-center">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  {user.firstname ? user.firstname : "---"}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.lastname ? user.lastname : "---"}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.gender ? user.gender : "---"}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.age ? user.age : "---"}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.role.name ? user.role.name : "---"}
                </td>
                <td
                  className={`px-6 py-4 text-center ${
                    user.is_active ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {user.is_active ? "Active" : "Non Active"}
                </td>
                <td
                  className={`px-6 py-4 text-center ${
                    user.is_social ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {user.is_social ? "Active" : "Non Active"}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="text-blue-500 hover:underline me-3"
                  >
                    Detail
                  </Link>

                  <Link
                    to={`/admin/users/edit/${user.id}`}
                    className="text-green-500 hover:underline me-3"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
