import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useAuth();
  const formattedRegistrationDate = new Date(
    user.registrationDate
  ).toLocaleDateString();
  const formattedEndDate = new Date(user.endDate).toLocaleDateString();
  const registrationTermObj = JSON.parse(user.registrationTerm);
  const formattedRegistrationTerm = `${registrationTermObj.day} days, ${registrationTermObj.month} months, ${registrationTermObj.year} years`;
  if (user.email === undefined) {
    return <h1>User Not Found</h1>;
  }
  console.log(user);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <FaUserAlt></FaUserAlt>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
          }}
        >
          <h1 style={{ fontSize: "1rem" }}>Profile</h1>
          <h1 style={{ fontSize: "2rem" }}>{user.email}</h1>
        </div>
      </div>
      <div className={styles.block}>
        <p className={styles.field}>
          Registration Date: {formattedRegistrationDate}
        </p>
        <p className={styles.field}>
          Registration Term: {formattedRegistrationTerm}
        </p>
        <p className={styles.field}>End Date: {formattedEndDate}</p>
      </div>
      {!user.isAdmin && (
        <h1
          style={{
            fontSize: "2rem",
            color: "black",
            fontFamily: "Roboto",
            padding: "20px 2px",
          }}
        >
          To access these privileges contact us
        </h1>
      )}
      <div className={styles.block}>
        {user.isAdmin && (
          <p className={styles.field}>
            Is Admin: {user.isAdmin ? "Yes" : "No"}
          </p>
        )}
        <p className={styles.field}>
          Can Download: {user.canDownload ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
