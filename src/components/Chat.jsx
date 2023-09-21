import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import ContactDetails from "./ContactDetails";
import chatimg from "../im/chat.gif";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectUser, setSelectUser] = useState(null);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessage] = useState([]);
  const MessageBoxRef = useRef();

  

  useEffect(() => {
    connectTows();
  }, []);

  // http://localhost:4000/

  const connectTows = () => {
    const ws = new WebSocket("wss://chatserver-6fpp.onrender.com/users");
    setWs(ws);
    // https:

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnect trying to reconnect!!!");
        connectTows();
      }, 1000);
    });
  };

  const showOnlinePeople = (peopleArr) => {
    const people = {};
    peopleArr.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    // console.log(e, messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectUser) {
        setMessage((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectUser,
        text: newMessage,
        file,
      })
    );
    setNewMessage("");
    setMessage((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id,
        recipient: selectUser,
        _id: Date.now(),
      },
    ]);
    if (file) {
      if (file) {
        axios.get("/message/" + selectUser).then((res) => {
          setMessage(res.data);
        });
      }
    }
  };

  
  useEffect(() => {
    const div = MessageBoxRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);


  useEffect(() => {
    axios.get("/users/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectUser) {
      axios.get("users/message/" + selectUser).then((res) => {
        setMessage(res.data);
      });
    }
  }, [selectUser]);

  const onlinePeopleEXclOurUSer = { ...onlinePeople };
  delete onlinePeopleEXclOurUSer[id];

  const messageWithoutDupes = uniqBy(messages, "_id");

  const logout = () => {
    axios.post("/users/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  };

  const sendfile = (e) => {
    const files = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(files);
    reader.onload = () => {
      reader.result;
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
    
  };



  return (
    <div className="flex h-screen ">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />

          {Object.keys(onlinePeopleEXclOurUSer).map((userId) => (
            <ContactDetails
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleEXclOurUSer[userId]}
              onClick={() => setSelectUser(userId)}
              selected={userId === selectUser}
            />
          ))}

          {Object.keys(offlinePeople).map((userId) => (
            <ContactDetails
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectUser(userId)}
              selected={userId === selectUser}
            />
          ))}
        </div>

        <div className="p-2 text-center flex  items-center justify-center ">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>
            Welcome {username}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-red-400 text-white py-1 px-2 border rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex  flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectUser && (
            <div className="flex h-full flex-grow  items-center justify-center">
              <div className="text-gray-400 flex ">
                <img src={chatimg} alt="" srcset="" />
              </div>
            </div>
          )}
          {!!selectUser && (
            <div className="mb-4 h-full ">
              <div className="relative h-full">
                <div className="absolute top-0 left-0 right-0 bottom-2 overflow-y-scroll">
                  {messageWithoutDupes.map((data) => (
                    <div
                      key={data._id}
                      className={data.sender == id ? "text-right" : "text-left"}
                    >
                      <div
                        className={
                          "inline-block p-2 my-2  rounded-md text-sm  " +
                          (data.sender === id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-500")
                        }
                      >
                        {data.text}
                        {data.file && (
                          <div className="flex items-center gap-1">
                            <a
                              className="underline flex items-center gap-1 "
                              href={
                                "https://chatserver-6fpp.onrender.com/uploads/" +
                                data.file
                              }
                              target="_blank"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                              </svg>

                              {data.file}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={MessageBoxRef}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {!!selectUser && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="type your message"
              className="bg-white flex-grow border p-2"
            />
            <label className="bg-blue-200 p-2 rounded-sm cursor-pointer border border-blue-300">
              <input type="file" className="hidden" onChange={sendfile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
