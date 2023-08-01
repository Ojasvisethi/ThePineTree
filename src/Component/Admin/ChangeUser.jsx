import { useState } from "react";
import styles from "./ChangeUser.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "../../UI/Spinner";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChangeUser() {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const navigate = useNavigate();

  return (
    <div className={styles.User}>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/admin")}
      ></FaArrowLeft>
      <h1 style={{ alignSelf: "center", marginTop: "0px", fontSize: "4rem" }}>
        User Details
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {select && (
          <Details
            user={select}
            search={search}
            setSelect={setSelect}
          ></Details>
        )}
        {select === null && (
          <Userdata
            setSelect={setSelect}
            search={search}
            setSearch={setSearch}
          ></Userdata>
        )}
      </div>
    </div>
  );
}

function Userdata({ setSelect, search, setSearch }) {
  return (
    <div className={styles.det}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "2px",
          marginBottom: "20px",
          alignSelf: "center",
        }}
      >
        <AiOutlineSearch className={styles.search_icon} />
        <input
          className={styles.in}
          style={{ border: "none" }}
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search"
        />
      </div>
      <UserNames search={search} setSelect={setSelect}></UserNames>
    </div>
  );
}

async function getUser(search) {
  console.log(search);
  try {
    const response = await fetch(
      `http://localhost:3000/user/getUsers?search=${encodeURIComponent(search)}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user data");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error("Error fetching user data");
  }
}

function UserNames({ search, setSelect }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", search], // search parameter could be any value you want to pass as a query parameter
    queryFn: () => getUser(search),
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError) {
    return <div>Error fetching audios</div>;
  }
  return (
    <>
      <h2
        style={{
          marginBottom: "10px",
          fontSize: "3rem",
        }}
      >
        Users
      </h2>
      <ul>
        {data?.map((user, index) => {
          return (
            <li
              key={user._id}
              onClick={() => {
                setSelect(user);
              }}
              className={styles.userlist}
            >
              <span className={styles.number}>{index + 1}.</span>
              <h1 className={styles.username}>{user.email}</h1>
            </li>
          );
        })}
      </ul>
    </>
  );
}

async function handleUp(updatedUserData, user) {
  console.log(updatedUserData);
  const response = await fetch(
    `http://localhost:3000/user/updateUser/${user._id}`,
    {
      method: "PATCH", // Use the PATCH method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    }
  );

  if (!response.ok) {
    throw new Error("Error updating user");
  }

  return response.json();
}

function Details({ user, setSelect }) {
  const [updatedEmail, setUpdatedEmail] = useState(user.email);
  const [updatedIsAdmin, setUpdatedIsAdmin] = useState(user.isAdmin);
  const [updatedCanDownload, setUpdatedCanDownload] = useState(
    user.canDownload
  );
  console.log(user);
  const [password, setPassword] = useState(user.password);
  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const updateUserMutation = useMutation({
    mutationFn: (updatedUserData) => handleUp(updatedUserData, user),
    onSuccess: () => {
      toast.success("User Updated successfully.");
      // Do something with the uploaded data if needed
    },
    onError: (error) => {
      toast.error("An error occurred during user update.");
      console.error(error);
    },
  });

  const handleUpdate = async () => {
    try {
      let registrationTerm = null;
      if (day !== 0 || month !== 0 || year !== 0) {
        registrationTerm = {
          day: parseInt(day, 10),
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };
      }
      console.log(registrationTerm);
      // Call the updateUserMutation function to send data to the backend
      const response = await updateUserMutation.mutateAsync({
        ...user,
        email: updatedEmail,
        isAdmin: updatedIsAdmin,
        canDownload: updatedCanDownload,
        password: password,
        registrationTerm: JSON.stringify(registrationTerm),
      });

      console.log("Updated User Data:", response);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className={styles.det}>
      <div className={styles.back}>
        <button className={styles.buttn} onClick={() => setSelect(null)}>
          <FaArrowLeft style={{ color: "white" }}></FaArrowLeft>
        </button>
        <h1 className={styles.username}>{user.email}</h1>
      </div>
      <div className={styles.upfile}>
        <label>Email</label>
        <input
          type="text"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
          placeholder={user.email}
          className={styles.input}
        />
      </div>
      <div className={styles.upfile}>
        <label>Is Admin</label>
        <input
          type="checkbox"
          checked={updatedIsAdmin}
          onChange={(e) => setUpdatedIsAdmin(e.target.checked)}
        />
      </div>
      <div className={styles.upfile}>
        <label>Can Download</label>
        <input
          type="checkbox"
          checked={updatedCanDownload}
          onChange={(e) => setUpdatedCanDownload(e.target.checked)}
        />
      </div>
      <div className={styles.upfile}>
        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.term}>
        <label htmlFor="setterm">Set Term</label>
        <input
          id="day"
          className={styles.date}
          type="number"
          placeholder="Enter days"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
        <label htmlFor="day">Day</label>
        <input
          id="month"
          className={styles.date}
          type="number"
          placeholder="Enter months"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <label htmlFor="month">Month</label>
        <input
          id="year"
          className={styles.date}
          type="number"
          placeholder="Enter years"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <label htmlFor="year">Year</label>
      </div>
      <button
        className={styles.btn}
        style={{ marginTop: "5px" }}
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  );
}

export default ChangeUser;
