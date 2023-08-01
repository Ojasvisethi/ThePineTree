import { Outlet } from "react-router-dom";
import styles from "./Admin.module.css";
import { useAuth } from "../../Context/AuthContext";
function Admin() {
  const { user } = useAuth();
  //   const navigate = useNavigate();
  console.log(user);

  //   useEffect(() => {
  //     if (user.isAdmin !== true) {
  //       // navigate("/dashboard");
  //     }
  //   }, [navigate, user]);
  return (
    <div className={styles.container}>
      <Outlet></Outlet>
    </div>
  );
}

export default Admin;
