import { useState } from "react";
import styles from "./NewUser.module.css";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NewUser() {
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const [download, setDownload] = useState(false);
  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const navigate = useNavigate();

  // Create a mutation function for creating a new user
  const createUserMutation = useMutation({
    mutationFn: (newUser) =>
      fetch("http://localhost:3000/auth/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }).then((response) => {
        if (!response.ok) {
          toast.error("Network response was not ok");
        }
        return response.json();
      }),
    onSuccess: (data, variables) => {
      // Reset the form fields to their initial values
      setEmail("");
      setAdmin(false);
      setDownload(false);
      setDay(0);
      setMonth(0);
      setYear(0);
      console.log(data, variables);
      toast.success("User created");
      toast.success(data.password);
    },
    onError: (error) => {
      toast.error("An error occurred during user creation.");
      console.error("Error uploading files:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const isRegistrationTermZero = day === 0 && month === 0 && year === 0;
    console.log(isRegistrationTermZero);
    // Conditionally add the registrationTerm to the newUser object
    const newUser = {
      email,
      isAdmin: admin,
      canDownload: download,
      ...(isRegistrationTermZero
        ? {}
        : { registrationTerm: { day, month, year } }),
    };

    // Call the mutation function to create the user
    createUserMutation.mutate(newUser);
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FaArrowLeft
          className={styles.backDash}
          onClick={() => navigate("/admin")}
        ></FaArrowLeft>
        <h1 style={{ fontSize: "3rem" }}>New User</h1>
        <div className={styles.inputs}>
          <div className={styles.input}>
            <label htmlFor="name">Email</label>
            <input
              id="email"
              className={styles.newuser}
              type="text"
              placeholder="Enter email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="download">Allow Download</label>
            <select
              id="download"
              className={styles.newuser}
              placeholder="Enter your password"
              value={download}
              onChange={(e) => setDownload(e.target.value)}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className={styles.input}>
            <label htmlFor="download">Admin</label>
            <select
              id="download"
              className={styles.newuser}
              placeholder="Enter your password"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
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
          <button type="submit" className={styles.btn}>
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewUser;
