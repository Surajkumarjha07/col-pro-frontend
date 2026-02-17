import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from "../redux/hooks";

export default function ManageAccount() {
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [action, setAction] = useState<string>("update");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const navigate = useNavigate();
  const token = useAppSelector(state => state.User.token);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/log-in");
      return;
    }

    const payload: any = jwtDecode(token);

    setEmail(payload.email);
    setName(payload.name);
  }, []);

  const handleActionType = (e: React.MouseEvent, actionType: string) => {
    e.preventDefault();
    setAction(actionType);
  };

  const updateAccount = async (e: React.MouseEvent | MouseEvent) => {
    e.preventDefault();
    setSubmitClicked(true);

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/update-user`,
        {
          newEmail: email,
          newName: name,
          newPassword,
          password: oldPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        },
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setSubmitClicked(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ?? "Internal server error!";
        toast.error(message);
        setSubmitClicked(false);
      }
    }

  };

  const deleteAccount = async (e: React.MouseEvent | MouseEvent) => {
    e.preventDefault();
    setSubmitClicked(true);

    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete-user`,
        {
          data: {
            password: oldPassword
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`            
          },
          withCredentials: true
        },
      )

      if (response.status === 200) {
        toast.success("User deleted successfully!");
        setSubmitClicked(false);
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ?? "Internal server error!";
        toast.error(message);
        setSubmitClicked(false);
      }
    }

  }

  return (
    <>
      {
        <section className="py-3 w-screen h-screen bg-linear-to-b from from-gray-200 to-white flex justify-center items-center">
          <aside className="w-1/2 h-screen flex flex-col justify-center gap-6 px-20">
            <p className="text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-4xl">Manage your Accounts</span>
              <br />
              with Us!
              <br />
              <div>
                <span className="inline-block font-bold text-gray-900 leading-tight">
                  {action === "update" ? (
                    <>
                      <span className="text-purple-500 font-bold">Update!</span>{" "}
                      <span className="text-3xl">
                        your credentials timely
                        <br />
                        to stay secure
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-purple-500 font-bold">Sad!</span>{" "}
                      <span className="text-3xl">to see you go</span>
                    </>
                  )}
                </span>
              </div>
            </p>

            <p className="text-xl text-gray-700 font-medium">
              Change your mind?
              <Link to="/home">
                <span className="text-gray-900 font-bold underline">
                  {" "}
                  Home{" "}
                </span>
              </Link>
            </p>
          </aside>

          <aside className="w-1/2 h-screen flex justify-center items-center">
            <form
              className="w-3/5 bg-gray-100 relative mx-auto h-fit px-10 pt-4 pb-8 rounded-xl shadow-md shadow-gray-300"
            >
              <fieldset>
                <div className="w-full relative mb-4">
                  <button
                    className={`${
                      action === "update" ? "text-gray-900" : "text-gray-500"
                    } rounded-t-md w-1/2 py-3 font-medium`}
                    onClick={(e) => handleActionType(e, "update")}
                  >
                    Update
                  </button>

                  <button
                    className={`${
                      action === "delete" ? "text-gray-900" : "text-gray-500"
                    } rounded-t-md w-1/2 py-3 font-medium`}
                    onClick={(e) => handleActionType(e, "delete")}
                  >
                    Delete
                  </button>

                  <div
                    className={`w-1/2 h-0.75 bg-gray-900 rounded-md ${
                      action == "update" ? "translate-x-0" : "translate-x-full"
                    } transition-all duration-200`}
                  />
                </div>

                <div className="text-left">
                  {action === "update" && (
                    <>
                      <input
                        type="email"
                        placeholder="youremail@gmail.com"
                        name="email"
                        className="h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <br />
                      <br />
                      <input
                        type="name"
                        placeholder="your name"
                        name="name"
                        className="h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <br />
                      <br />
                      <input
                        type="password"
                        placeholder="New Password"
                        name="new_password"
                        className="h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <br /> <br />
                    </>
                  )}

                  <input
                    type="password"
                    placeholder="Password"
                    name="old_password"
                    className="h-12 mt-2 px-3 w-full placeholder:text-sm border-2 border-gray-200 rounded-md outline-none"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />

                  {action === "update" ? (
                    <div className="text-center mt-8">
                      <input
                        type="submit"
                        className={`w-full cursor-pointer ${
                          submitClicked ? "bg-purple-400" : "bg-purple-500"
                        } rounded-lg py-3 text-white font-semibold`}
                        value={submitClicked ? "Updating..." : "Update"}
                        onClick={updateAccount}
                      />
                    </div>
                  ) : (
                    <div className="text-center mt-8">
                      <input
                        type="submit"
                        className={`w-full cursor-pointer ${
                          submitClicked ? "bg-purple-400" : "bg-purple-500"
                        } rounded-lg py-3 text-white font-semibold`}
                        value={submitClicked ? "Deleting..." : "Delete"}
                        onClick={deleteAccount}
                        disabled={!oldPassword}
                      />
                    </div>
                  )}
                </div>
              </fieldset>
            </form>
          </aside>
        </section>
      }
    </>
  );
}
