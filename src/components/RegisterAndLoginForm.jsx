import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";


const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginRegister] = useState("login");
  const { setUsername: setLoggedInUserName, setID } = useContext(UserContext);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "users/register" : "users/login"
 
    const { data } = await axios.post(url, {
      username,
      password,
    });

    setLoggedInUserName(username), setID(data.id);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleRegister}>
        <input
          type="text"
          name=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          name=""
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="password"
          id=""
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister == "register" ? "Register" : "login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister == "register" && (
            <div>
              Already have account?
              <button className="ml-2" onClick={() => setIsLoginRegister("login")}>
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            
            <div>
              Don't have an account?
              <button  className="ml-2" onClick={() => setIsLoginRegister("register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
