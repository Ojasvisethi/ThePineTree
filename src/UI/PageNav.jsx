import { Link, NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useEffect, useState } from "react";
import { FiList } from "react-icons/fi";

function PageNav({ activeLink, scrollToSection }) {
  const [ham, setHam] = useState(window.innerWidth < 500);
  const [open, setIsOpen] = useState(window.innerWidth > 500);
  const [scrollpos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setHam(window.innerWidth < 500);
      setIsOpen(window.innerWidth > 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navClass = `${styles.nav} ${scrollpos > 200 ? styles.pagenav : ""}`;
  const handleHamClick = () => {
    setIsOpen(!open); // Toggle the 'ham' state when the hamburger icon is clicked
  };

  return (
    <nav className={navClass}>
      <Link to="/" className={styles.comp}>
        <img src="/Logo.png" alt="WorldWise logo" className={styles.logo} />
        <div className={styles.mainHead}>
          <span className={styles.main1}>The Pine Tree </span>
          <span className={styles.main2}>Media and Entertainment </span>
        </div>
      </Link>

      {ham && (
        <div className={styles.fields}>
          <FiList onClick={handleHamClick}></FiList>
        </div>
      )}
      {open && (
        <ul className={styles.fields}>
          <li>
            <Link
              to="/"
              onClick={() => scrollToSection("home")}
              className={styles.lin}
              style={
                activeLink === "home" ? { color: "rgb(132, 132, 228)" } : {}
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="#AboutUs"
              onClick={() => scrollToSection("AboutUs")}
              className={styles.lin}
              style={
                activeLink === "AboutUs" ? { color: "rgb(132, 132, 228)" } : {}
              }
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="#Collabaration"
              onClick={() => scrollToSection("Collabaration")}
              className={styles.lin}
              style={
                activeLink === "Collabaration"
                  ? { color: "rgb(132, 132, 228)" }
                  : {}
              }
            >
              Collaboration
            </Link>
          </li>
          <li>
            <Link
              to="#ContactUs"
              onClick={() => scrollToSection("ConatctUs")}
              className={styles.lin}
              style={
                activeLink === "ContactUs"
                  ? { color: "rgb(132, 132, 228)" }
                  : {}
              }
            >
              Contact Us
            </Link>
          </li>
        </ul>
      )}
      <div className={styles.login}>
        <NavLink to="/login" className={styles.logbtn}>
          Login
        </NavLink>
      </div>
    </nav>
  );
}

export default PageNav;
