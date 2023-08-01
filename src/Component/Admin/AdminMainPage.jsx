import styles from "./AdminMainPage.module.css";
import { FaArrowLeft } from "react-icons/fa";
// import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminMainPage() {
  // const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/dashboard")}
      ></FaArrowLeft>
      <h1 className={styles.header}>Admin DashBoard</h1>
      <div className={styles.functions}>
        <div
          onClick={() => {
            navigate("/admin/uploadSong");
          }}
          className={`${styles.block}`}
        >
          Upload A new Song
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/NewUser");
          }}
        >
          Create A New User
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/ChangeUser");
          }}
        >
          Change User Permissions
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/DisableSong");
          }}
        >
          Disable songs
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/EnableSong");
          }}
        >
          Enable songs
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/AddGenOrArt");
          }}
        >
          Add Genre Or Artist
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/DisableArt");
          }}
        >
          Disable Artist
        </div>
        <div
          className={`${styles.block}`}
          onClick={() => {
            navigate("/admin/EnableArt");
          }}
        >
          Enable Artist
        </div>
      </div>
    </div>
  );
}

export default AdminMainPage;

// const uploadFile = async (file, filename, contentType) => {
//   const response = await fetch(
//     `http://localhost:3000/upload?filename=${filename}&contentType=${contentType}`
//   );
//   if (!response.ok) {
//     throw new Error("Error generating signed URL.");
//   }
//   const presignedUrl = await response.text();

//   await fetch(presignedUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": contentType,
//     },
//     body: file,
//   });

//   return presignedUrl;
// };

// function UploadComponent() {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState("");

//   const mutation = useMutation({
//     mutationFn: uploadFile,
//     onSuccess: (data) => {
//       setResponse(`File uploaded successfully. URL: ${data}`);
//     },
//     onError: (error) => {
//       setResponse("An error occurred during file upload.");
//       console.error("Error uploading file:", error);
//     },
//   });

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (!file) {
//       setResponse("Please select a file.");
//       return;
//     }

//     const filename = encodeURIComponent(file.name);
//     const contentType = encodeURIComponent(file.type);

//     mutation.mutate({ file, filename, contentType });
//   };

//   return (
//     <div className={styles.form}>
//       <h2>Upload Audio File</h2>
//       <input
//         type="file"
//         accept="audio/*"
//         onChange={handleFileChange}
//         className={styles.input}
//       />
//       <button
//         onClick={handleUpload}
//         disabled={mutation.isLoading}
//         className={styles.btn}
//       >
//         {mutation.isLoading ? "Uploading..." : "Upload"}
//       </button>
//       <p>{response}</p>
//     </div>
//   );
// }

// eslint-disable-next-line react-refresh/only-export-components
export async function getSong(search, page = 0, pageSize = 10, field, name) {
  console.log(name, field, search);
  try {
    const response = await fetch(
      `http://localhost:3000/music/getSongs?search=${encodeURIComponent(
        search
      )}&field=${field}&page=${page}&pageSize=${pageSize}&name=${name}`
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
