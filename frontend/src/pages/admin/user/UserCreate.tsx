import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../../../components/admin/user/UserForm";
import { createUser } from "../../../api/userApi";

const UserCreate: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [firstname, setFirsname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("admin");
  const [is_active, setIsIActive] = useState<boolean>(false);
  const [is_social, setIsSocial] = useState<boolean>(false);
  const [avatar_base64, setAvatarBase64] = useState<string | null>(null);
  const [avatar_mime_type, setAvatarMimeType] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: any = {
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

    console.log(JSON.stringify(newUser));

    createUser(newUser)
      .then(() => {
        navigate("/admin/users");
      })
      .catch((_err) => {
        alert("Error creating user");
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UserForm
        formHeader="Create User"
        username={username}
        setUsername={setUsername}
        firstname={firstname}
        setFirstname={setFirsname}
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
        setIsActive={setIsIActive}
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

export default UserCreate;
