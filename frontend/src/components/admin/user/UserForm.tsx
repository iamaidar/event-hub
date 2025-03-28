import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface UserFormProps {
  formHeader: string;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  firstname: string;
  setFirstname: React.Dispatch<React.SetStateAction<string>>;
  lastname: string;
  setLastname: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  age: number;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  is_active: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  is_social: boolean;
  setIsSocial: React.Dispatch<React.SetStateAction<boolean>>;
  avatar_base64: string | null;
  setAvatarBase64: React.Dispatch<React.SetStateAction<string | null>>;
  setAvatarMimeType: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  formHeader,
  username,
  setUsername,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  gender,
  setGender,
  age,
  setAge,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  is_active,
  setIsActive,
  is_social,
  setIsSocial,
  avatar_base64,
  setAvatarBase64,
  setAvatarMimeType,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
        setAvatarMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">{formHeader}</h2>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="w-4/6">
            <div className="mb-4">
              <label className="block text-gray-700 pl-3">Username</label>
              <input
                type="text"
                value={username}
                maxLength={255}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 pl-3">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
              />
            </div>
          </div>
          <div>
            {avatar_base64 && (
              <img
                src={avatar_base64}
                alt="Avatar Preview"
                className="w-32 h-32 object-cover rounded-lg mt-2"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 pl-3">First Name</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 pl-3">Last Name</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 pl-3">Gender</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 pl-3">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 pl-3">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 pl-3">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={is_active}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-3"
          />
          <span className="text-gray-700">Active</span>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={is_social}
            onChange={(e) => setIsSocial(e.target.checked)}
            className="mr-3"
          />
          <span className="text-gray-700">Social Account</span>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
