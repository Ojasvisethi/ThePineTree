import { useQuery } from "@tanstack/react-query";

import styles from "./Search.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import List from "../UI/List";
import { getSong } from "../Component/Admin/AdminMainPage";
import Spinner from "../UI/Spinner";
import { useSong } from "../Context/SongContext";

// eslint-disable-next-line react-refresh/only-export-components
export async function getGenreAndArtist(showAll, GenOrArtsearch = "") {
  const limit = showAll === 0 ? 4 : null;
  console.log(showAll);
  try {
    const response = await fetch(
      `http://localhost:3000/music/getGenreAndArtist?limit=${limit}&GenOrArtsearch=${GenOrArtsearch}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user data");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log();
    throw new Error("Error fetching user data");
  }
}

function Search() {
  const [GenOrArtsearch, setGenOrArtSearch] = useState("");
  const [idx, setIdx] = useState(null);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Explore</span>
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
            value={GenOrArtsearch}
            onChange={(e) => setGenOrArtSearch(e.target.value)}
          />
        </div>
      </div>

      <hr
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "10px",
          height: "2px",
          backgroundColor: "#d9d9d9",
          border: "none",
        }}
      ></hr>

      <SearchBar
        GenOrArtsearch={GenOrArtsearch}
        setIdx={setIdx}
        idx={idx}
      ></SearchBar>
    </div>
  );
}

function SearchBar({ GenOrArtsearch }) {
  const [showAll, setShowAll] = useState(0);
  const [fieldSelect, setFieldSelect] = useState(null);
  const { data: data, isError: isErrorGenArt } = useQuery({
    queryKey: ["audio", showAll, GenOrArtsearch], // Include page and 6 in the query key
    queryFn: () => getGenreAndArtist(showAll, GenOrArtsearch),
    refetchOnMount: "always", // Pass page and 6 to the query function
  });

  if (isErrorGenArt) {
    return <div>Error fetching audios</div>;
  }
  return (
    <>
      {!fieldSelect && (
        <>
          {showAll !== 2 && (
            <>
              <div className={styles.listheader}>
                {showAll !== 0 && (
                  <button className={styles.back} onClick={() => setShowAll(0)}>
                    <FaArrowLeft></FaArrowLeft>
                  </button>
                )}
                <p>By Genre</p>
                {showAll === 0 && (
                  <button
                    onClick={() => setShowAll(1)}
                    className={styles.showAll}
                  >
                    Show All
                  </button>
                )}
              </div>
              <div className={styles.list}>
                <AudioGallery
                  setFieldSelect={setFieldSelect}
                  audios={data?.genres}
                />
              </div>
            </>
          )}
          {showAll !== 1 && (
            <>
              <div style={{ paddingTop: "20px" }} className={styles.listheader}>
                {showAll !== 0 && (
                  <button className={styles.back} onClick={() => setShowAll(0)}>
                    <FaArrowLeft></FaArrowLeft>
                  </button>
                )}
                <p>By Artist</p>
                {showAll === 0 && (
                  <button
                    onClick={() => setShowAll(2)}
                    className={styles.showAll}
                  >
                    Show All
                  </button>
                )}
              </div>
              <div className={styles.list}>
                <AudioGallery
                  setFieldSelect={setFieldSelect}
                  audios={data?.artists}
                />
              </div>
            </>
          )}
        </>
      )}
      {fieldSelect && (
        <div style={{ marginLeft: "10px" }}>
          <FaArrowLeft
            style={{ fontSize: "25px" }}
            onClick={() => setFieldSelect(null)}
          ></FaArrowLeft>
          <SongList
            songsearch={GenOrArtsearch}
            fieldSelect={fieldSelect}
          ></SongList>
        </div>
      )}
    </>
  );
}

function SongList({ fieldSelect, songsearch }) {
  const [page, setPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);

  const { dispatch } = useSong();
  const {
    data: audios,
    isLoading: isLoadingAudioList,
    isError: isErrorAudioList,
  } = useQuery({
    queryKey: ["audio", songsearch, page],
    queryFn: () =>
      getSong(
        songsearch,
        (page - 1) * 6,
        6,
        fieldSelect.type,
        fieldSelect.name
      ), // Adjust the pagination parameters for the backend query
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    onSuccess: (data) => {
      setTotalSongs(data.totalSongs);
    },
  });

  function handleSong(song) {
    console.log(song);
    dispatch({ type: "SetSong", payLoad: { song, songList: audios } });
  }

  function handlePreviousPage() {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function handleNextPage() {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(totalSongs / 6)));
  }

  if (isLoadingAudioList) {
    return <Spinner />;
  }

  if (isErrorAudioList) {
    return <div>Error fetching audios</div>;
  }

  return (
    <div className={styles.AllSongs}>
      {audios.songs.map((audio) => (
        <List handleSong={handleSong} audio={audio} key={audio._id} />
      ))}
      <div className={styles.Pagi}>
        <button
          className={styles.showAll}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <FaArrowLeft></FaArrowLeft>
        </button>
        <span>{`Page ${page} of ${Math.ceil(totalSongs / 6)}`}</span>
        <button
          className={styles.showAll}
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalSongs / 6)}
        >
          <FaArrowRight></FaArrowRight>
        </button>
      </div>
    </div>
  );
}

function AudioGallery({ audios, setFieldSelect }) {
  return (
    <>
      {audios?.map((audio) => (
        <div
          key={audio._id}
          className={styles.song}
          style={{
            backgroundColor: audio.type === "genre" ? "#151a27" : "#404657",
            color: "white",
          }}
          onClick={() => setFieldSelect({ type: audio.type, name: audio.name })}
        >
          <p className={styles.genName}>{audio.name}</p>
          <p>
            <br />
          </p>
        </div>
      ))}
    </>
  );
}

export default Search;
