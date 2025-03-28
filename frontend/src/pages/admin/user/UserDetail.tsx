import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserById, User } from "../../../api/userApi.tsx";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserById(id)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка при загрузке данных пользователя");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl mx-auto flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {user.username}
          </h1>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstname || "N/A"}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastname || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {user.age ?? "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role.name}
            </p>
            <p>
              <strong>Active:</strong> {user.is_active ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Social User:</strong>{" "}
              {user.is_social ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Avatar Mime Type:</strong>{" "}
              {user.avatar_mime_type || "N/A"}
            </p>
            <Link
              to="/admin/users"
              className="mt-6 inline-block bg-purple-500 text-white px-4 py-2 rounded-full shadow hover:bg-purple-600 transition"
            >
              ← Back to Users List
            </Link>
          </div>
        </div>
        <div>
          {user.avatar_base64 ? (
            <img
              src={user.avatar_base64}
              alt={user.username}
              className="w-50 rounded-2xl"
            />
          ) : (
            <img
              src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
              alt="Placeholder"
              className=""
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
