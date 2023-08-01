import { AiOutlineSearch } from "react-icons/ai";
import styles from "./Songs.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSong } from "../Component/Admin/AdminMainPage";
import Spinner from "../UI/Spinner";
import List from "../UI/List";
import { useSong } from "../Context/SongContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Songs() {
  const [songsearch, setSongSearch] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>All Songs</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "16px",
            marginBottom: "20px",
          }}
        >
          <AiOutlineSearch className={styles.search_icon} />
          <input
            className={styles.in}
            style={{ border: "none" }}
            placeholder="Search songs"
            value={songsearch}
            onChange={(e) => setSongSearch(e.target.value)}
          />
        </div>
      </div>
      <hr
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          marginRight: "20px",
          height: "2px",
          backgroundColor: "#d9d9d9",
          border: "none",
        }}
      ></hr>
      <SongList songsearch={songsearch} />
    </div>
  );
}

function SongList({ songsearch }) {
  const [page, setPage] = useState(1);
  const { dispatch } = useSong();
  const [totalSongs, setTotalSongs] = useState(0);
  const pageSize = 7;
  const {
    data: audios,
    isLoading: isLoadingAudioList,
    isError: isErrorAudioList,
  } = useQuery({
    queryKey: ["audio", songsearch, page, pageSize],
    queryFn: () => getSong(songsearch, page - 1, pageSize),
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    onSuccess: (data) => {
      setTotalSongs(data.totalSongs);
    },
  });

  function handlePreviousPage() {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  // Update handleNextPage to handle modulus operation
  function handleNextPage() {
    setPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(totalSongs / pageSize))
    );
  }

  function handleSong(song) {
    console.log(song);
    dispatch({ type: "SetSong", payLoad: { song, songList: audios } });
  }

  if (isLoadingAudioList) {
    return <Spinner></Spinner>;
  }

  if (isErrorAudioList) {
    return <div>Error fetching audios</div>;
  }
  console.log(audios);
  return (
    <div className={styles.AllSongs}>
      {audios.songs.map((audio) => (
        <List handleSong={handleSong} audio={audio} key={audio._id}></List>
      ))}
      <div className={styles.Pagi}>
        <button
          className={styles.showAll}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <FaArrowLeft></FaArrowLeft>
        </button>
        <span>{`Page ${page} of ${Math.ceil(totalSongs / pageSize)}`}</span>
        <button
          className={styles.showAll}
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalSongs / pageSize)}
        >
          <FaArrowRight></FaArrowRight>
        </button>
      </div>
    </div>
  );
}

export default Songs;
