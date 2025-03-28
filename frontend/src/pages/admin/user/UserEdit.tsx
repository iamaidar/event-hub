import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../../../api/userApi";
import UserForm from "../../../components/admin/user/UserForm";

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");
  const [is_active, setIsActive] = useState<boolean>(false);
  const [is_social, setIsSocial] = useState<boolean>(false);
  const [avatar_base64, setAvatarBase64] = useState<string | null>(null);
  const [avatar_mime_type, setAvatarMimeType] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchUserById(id)
        .then((data) => {
          setUsername(data.username);
          setFirstname(data.firstname || "");
          setLastname(data.lastname || "");
          setGender(data.gender || "");
          setAge(data.age || 0);
          setEmail(data.email);
          setPassword("");
          setRoleName(data.role.name);
          setIsActive(data.is_active);
          setIsSocial(data.is_social ?? false);
          setAvatarBase64(data.avatar_base64 || null);
          setAvatarMimeType(data.avatar_mime_type || "");
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ Error loading user data:", error);
          setError("Error loading user data.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: any = {
      username,
      firstname,
      lastname,
      gender,
      age,
      email,
      password,
      roleName,
      is_active,
      is_social,
      avatar_base64,
      avatar_mime_type,
    };

    if (id) {
      updateUser(id, updatedUser)
        .then(() => {
          navigate("/admin/users");
        })
        .catch((error) => {
          console.error(
            "❌ Error updating user:",
            error.response?.data || error,
          );
          alert(
            "Error updating user: " +
              (error.response?.data?.message.join(", ") || "Unknown error"),
          );
        });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserForm
        formHeader="Edit User"
        username={username}
        setUsername={setUsername}
        firstname={firstname}
        setFirstname={setFirstname}
        lastname={lastname}
        setLastname={setLastname}
        gender={gender}
        setGender={setGender}
        age={age}
        setAge={setAge}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        role={roleName}
        setRole={setRoleName}
        is_active={is_active}
        setIsActive={setIsActive}
        is_social={is_social}
        setIsSocial={setIsSocial}
        avatar_base64={avatar_base64}
        setAvatarBase64={setAvatarBase64}
        setAvatarMimeType={setAvatarMimeType}
        onSubmit={handleSubmit}
      ></UserForm>
    </div>
  );
};

export default UserEdit;
