import { useState } from "react";
import styles from "./Mail.module.css";
import { useQuery } from "@tanstack/react-query";
import SpinnerFullPage from "../UI/SpinnerFullPage";
import { FaMailBulk } from "react-icons/fa";

function Mail() {
  const [selected, setSelected] = useState(0);
  const {
    data: requests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/request/getReq");
      if (!response.ok) {
        throw new Error("Error fetching requests");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <SpinnerFullPage></SpinnerFullPage>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaMailBulk></FaMailBulk>
        <h1 style={{ fontSize: "4rem", paddingLeft: "20px" }}>Mails</h1>
      </div>
      <div>
        {isError && <div>Error fetching requests</div>}
        {requests && (
          <ul className={styles.requestList}>
            {requests.map((request) => (
              <>
                <li
                  key={request._id}
                  className={styles.requestItem}
                  onClick={() =>
                    setSelected((prev) =>
                      prev === request._id ? 0 : request._id
                    )
                  }
                >
                  <h3>{request.name}</h3>
                  <h3>Mobile Number :{request.mobileNumber}</h3>
                </li>

                {selected === request._id && (
                  <div className={styles.details}>
                    <p>Email: {request.email}</p>
                    <p>Message: {request.message}</p>
                  </div>
                )}
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Mail;
