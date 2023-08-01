import styles from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
// import { useMutation } from "@tanstack/react-query";

function Login() {
  const { isAuthenticated, handleSubmit } = useAuth();
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setEmail("");
      setPassword("");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    console.log(sessionToken);
    if (sessionToken || isAuthenticated) {
      navigate("/dashboard"); // Redirect the user to the dashboard if already logged in
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className={styles.box}>
      <div className={styles.nav}>
        <Link to="/" className={styles.comp}>
          <img src="/Pine.jpeg" alt="WorldWise logo" className={styles.logo} />
          <span className={styles.main}>The Pine Tree Media</span>
        </Link>
      </div>
      <div className={styles.container}>
        <div className={styles.inputs}>
          <h1 className={styles.login}>Login to AudioTrack</h1>
          <div className={styles.LoginForm}>
            {/* <div className={styles.input}>
              <label className={styles.label} htmlFor="name">
                Username
              </label>
              <input
                className={styles.data}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div> */}
            <div className={styles.input}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.data}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.input}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.data}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className={styles.btn}
            onClick={() => handleSubmit(email, password)}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
