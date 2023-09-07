// import React, { useContext, useState } from "react";
// import axios from "axios";
// import { UserContext } from "./UserContext";
// import home from "../im/home.webp";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const RegisterAndLoginForm = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoginOrRegister, setIsLoginRegister] = useState("login");
//   const { setUsername: setLoggedInUserName, setID } = useContext(UserContext);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const url =
//       isLoginOrRegister === "register" ? "users/register" : "users/login";

//     try {
//       if (username === "" || password === "") {
//         toast.error("Fill the form", {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//         return;
//       }

//       if (username.length < 3) {
//         toast.error("Username must be at least 3 letters", {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//         return;
//       }

//       if (password.length < 3) {
//         toast.error("Password must be at least 3 letters", {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//         return;
//       }

//       const { data } = await axios.post(url, {
//         username,
//         password,
//       });


      

//       if (isLoginOrRegister === "register") {
//         // Registration successful, now automatically switch to login
//         toast.success("Registration successful. Now you can login.", {
//           position: toast.POSITION.TOP_RIGHT,
//         });

//         // Update UI to switch to login
//         setIsLoginRegister("login");

//         // Clear the username and password fields
//         setUsername("");
//         setPassword("");
//       } else if (isLoginOrRegister === "login") {
//         // If the user clicked "Login" instead of "Register", set the user's data
//         setTimeout(() => {
//           setLoggedInUserName(username);
//           setID(data.id);
//         }, 1000);

//         // Show login success message
//         toast.success("Login successful.", {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//       }
//     } catch (error) {
//       if (error.response) {
//         if (error.response.status === 500) {
//           toast.error("User already exists", {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//         } else if (error.response.status === 404) {
//           toast.error("User not registered", {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//         }
//       }
//     }
//   };

//   return (
//     <div className="h-screen flex items-center bg-blue-50">
//       <div className="w-full md:w-auto mx-auto mb-12 bg-blue-50 bg-opacity-90 rounded-sm p-4">
//         <img
//           src={home}
//           alt="Your Alt Text Here"
//           className="block w-full rounded-sm mb-2"
//         />
//         <form onSubmit={handleRegister}>
//           <input
//             type="text"
//             name=""
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="username"
//             className="block w-full rounded-sm p-2 mb-2 border"
//           />
//           <input
//             type="password"
//             name=""
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             placeholder="password"
//             id=""
//             className="block w-full rounded-sm p-2 mb-2 border"
//           />
//           <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
//             {isLoginOrRegister === "register" ? "Register" : "Login"}
//           </button>
//           <div className="text-center mt-2">
//             {isLoginOrRegister === "register" && (
//               <div>
//                 Already have an account?
//                 <button
//                   className="ml-2"
//                   onClick={() => setIsLoginRegister("login")}
//                 >
//                   Login here
//                 </button>
//               </div>
//             )}
//             {isLoginOrRegister === "login" && (
//               <div>
//                 Don't have an account?
//                 <button
//                   className="ml-2"
//                   onClick={() => setIsLoginRegister("register")}
//                 >
//                   Register
//                 </button>
//               </div>
//             )}
//           </div>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default RegisterAndLoginForm;



import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import home from "../im/home.webp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginRegister] = useState("login");
  const { setUsername: setLoggedInUserName, setID } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const url =
      isLoginOrRegister === "register" ? "users/register" : "users/login";

    try {
      setIsLoading(true); // Set loading to true when the request starts

      if (username === "" || password === "") {
        toast.error("Fill out the form completely", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false); // Set loading to false on error
        return;
      }

      if (username.length < 3) {
        toast.error("Username must be at least 3 characters", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false); // Set loading to false on error
        return;
      }

      if (password.length < 3) {
        toast.error("Password must be at least 3 characters", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false); // Set loading to false on error
        return;
      }

      const { data } = await axios.post(url, {
        username,
        password,
      });

      if (isLoginOrRegister === "register") {
        // Registration successful, now automatically switch to login
        toast.success("Registration successful. Now you can log in.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Update UI to switch to login
        setIsLoginRegister("login");

        // Clear the username and password fields
        setUsername("");
        setPassword("");
      } else if (isLoginOrRegister === "login") {
        // If the user clicked "Login" instead of "Register", set the user's data
        setLoggedInUserName(username);
        setID(data.id);

        // Show login success message
        toast.success("Login successful.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("User already exists", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (error.response.status === 404) {
          toast.error("User not found", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (error.response.status === 400) {
          toast.error("User not registered", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error("An error occurred. Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl text-blue-600 mb-4 mt-4">VConnect</h1>
      <div className="w-full md:w-1/3 p-8 rounded-lg bg-white shadow-md">
        <img
          src={home}
          alt="Your Alt Text Here"
          className="block w-full mx-auto mb-4 max-h-40"
        />
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="block w-full rounded-sm p-2 mb-2 border focus:outline-none"
          />
          <input
            type="password"
            name=""
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="block w-full rounded-sm p-2 mb-2 border focus:outline-none"
          />
          <button
            type="submit" // Added type="submit"
            className={`${
              isLoginOrRegister === "register"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white block w-full rounded-full p-2 relative ${
              isLoading ? "bg-opacity-50" : ""
            }`}
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            {isLoginOrRegister === "register" ? "Register" : "Login"}
          </button>
          <div className="text-center mt-4">
            {isLoginOrRegister === "register" && (
              <div>
                Already have an account?
                <button
                  className="ml-2 text-blue-600 hover:underline focus:outline-none"
                  onClick={() => setIsLoginRegister("login")}
                >
                  Login here
                </button>
              </div>
            )}
            {isLoginOrRegister === "login" && (
              <div>
                Don't have an account?
                <button
                  className="ml-2 text-green-600 hover:underline focus:outline-none"
                  onClick={() => setIsLoginRegister("register")}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterAndLoginForm;
