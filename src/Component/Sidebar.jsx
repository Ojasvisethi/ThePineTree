import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { HiHome, HiUser } from "react-icons/hi2";
import { HiMail, HiMenuAlt2 } from "react-icons/hi";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.menu}>
        <p className={styles.dash}>Dashboard</p>
      </div>
      <div className={styles.menu}>
        <ul className={styles.control}>
          <li>
            <NavLink className={styles.link} to="/dashboard/search">
              <div className={styles.sideLink}>
                <HiHome></HiHome>{" "}
                <span style={{ paddingLeft: "15px" }}>Home</span>
              </div>
              <span>&gt;</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.link} to="/dashboard/songs">
              <div className={styles.sideLink}>
                <HiMenuAlt2></HiMenuAlt2>{" "}
                <span style={{ paddingLeft: "15px" }}>All Songs</span>
              </div>
              <span>&gt;</span>
            </NavLink>
          </li>
          <li>
            <NavLink className={styles.link} to="/dashboard/profile">
              <div className={styles.sideLink}>
                <HiUser></HiUser>{" "}
                <span style={{ paddingLeft: "15px" }}>Profile</span>
              </div>
              <span>&gt;</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/mails" className={styles.link}>
              <div className={styles.sideLink}>
                <HiMail></HiMail>
                <span style={{ paddingLeft: "15px" }}>Mails</span>
              </div>
              <span>&gt;</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
