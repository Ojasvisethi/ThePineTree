import { AiOutlineSearch } from "react-icons/ai";
import styles from "./DisableSong.module.css";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSong } from "./AdminMainPage";
import { toast } from "react-hot-toast";
import Spinner from "../../UI/Spinner";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DisableSong({ setSelect }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className={styles.delete}>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/admin")}
      ></FaArrowLeft>
      <h1 style={{ fontSize: "3rem" }}>Disable Song</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "2px",
          marginBottom: "5px",
          alignSelf: "center",
        }}
      >
        <AiOutlineSearch className={styles.search_icon} />
        <input
          className={styles.in}
          style={{ border: "none" }}
          placeholder="Search songs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search"
        />
      </div>
      <SongList
        navigate={navigate}
        setSelect={setSelect}
        search={search}
      ></SongList>
    </div>
  );
}

// Function to disable songs on the backend
async function disableSongs(songIds) {
  try {
    const response = await fetch("http://localhost:3000/music/disable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songIds }), // Sending songIds as JSON in the request body
    });

    if (!response.ok) {
      throw new Error("Error disabling songs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error disabling songs");
  }
}

function SongList({ search, navigate }) {
  const [field, setField] = useState("title");
  const [page, setPage] = useState(0);
  const pageSize = 5; // Set the page size as per your requirement
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["songs", search, field, page],
    queryFn: () => getSong(search, page, pageSize, field),
    refetchOnMount: "always",
  });

  const disableSongsMutation = useMutation(disableSongs, {
    onSuccess: () => {
      toast.success("Songs Disabled");
      navigate("/admin");
    },
    onMutate: (variables) => {
      // Capture the previous data before the mutation
      const previousData = queryClient.getQueryData(["songs", ...variables]);
      return previousData;
    },
    // Optionally, you can use onError to rollback changes on error
    // onError: (error, variables, previousData) => {
    //   queryClient.setQueryData(["songs", ...variables], previousData);
    // },
    onSettled: (data, error, variables) => {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries(["songs", ...variables]);
    },
  });

  const [selectedSongs, setSelectedSongs] = useState([]);

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError) {
    return <div>Error fetching audios</div>;
  }

  const toggleSongSelection = (songId) => {
    setSelectedSongs((prevSelectedSongs) => {
      if (prevSelectedSongs.includes(songId)) {
        return prevSelectedSongs.filter((id) => id !== songId);
      } else {
        return [...prevSelectedSongs, songId];
      }
    });
  };

  const disableSelectedSongs = () => {
    disableSongsMutation.mutate(selectedSongs);
  };

  return (
    <div>
      <div className={styles.sort}>
        <button
          className={`${field === "title" ? styles.btn : styles.bt}`}
          onClick={() => setField("title")}
        >
          Name
        </button>
        <button
          style={{ marginLeft: "20px" }}
          className={`${field === "artist" ? styles.btn : styles.bt}`}
          onClick={() => {
            setField("artist");
          }}
        >
          Artist
        </button>
      </div>
      <ul className={styles.userul} style={{ paddingLeft: "0px" }}>
        {data?.songs.map((song, index) => {
          const isSelected = selectedSongs.includes(song._id);
          return (
            <li
              key={song._id}
              className={`${styles.userlist} ${
                isSelected ? styles.selected : ""
              } ${song.isDisabled ? styles.disabled : ""}`}
              onClick={() => toggleSongSelection(song._id)}
            >
              <span className={styles.number}>
                {index + 1 + page * pageSize}.
              </span>
              <h1 className={styles.username}>{song.title}</h1>
              <h5 style={{ color: "white" }}>{song.isDisabled}</h5>
            </li>
          );
        })}
      </ul>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ padding: "5px 5px", width: "150px" }}
          className={styles.btn}
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
        >
          Previous Page
        </button>
        <button
          className={styles.btn}
          style={{ padding: "5px 5px", marginLeft: "20px" }}
          onClick={() =>
            setPage((prevPage) => (data?.hasMore ? prevPage + 1 : prevPage))
          }
        >
          Next Page
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className={styles.btn}
          style={{ width: "300px", marginTop: "5px" }}
          onClick={disableSelectedSongs}
        >
          Disable Selected Songs
        </button>
      </div>
    </div>
  );
}

export default DisableSong;
