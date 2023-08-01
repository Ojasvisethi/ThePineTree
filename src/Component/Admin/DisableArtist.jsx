import { AiOutlineSearch } from "react-icons/ai";
import styles from "./DisableArtist.module.css";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import { getGenreAndArtist } from "../../Pages/Search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function DisableArtist() {
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  return (
    <div className={styles.delete}>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/admin")}
      ></FaArrowLeft>
      <h1 style={{ fontSize: "3rem" }}>Disable Artist</h1>
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
      <ArtistList search={search} navigate={navigate}></ArtistList>
    </div>
  );
}

async function disableSongs(ArtistIds) {
  try {
    const response = await fetch("http://localhost:3000/music/disableArt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ArtistIds }), // Sending ArtistIds as JSON in the request body
    });

    if (!response.ok) {
      throw new Error("Error disabling songs");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error("Error disabling songs");
  }
}

function ArtistList({ search, navigate }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["songs", search],
    queryFn: () => getGenreAndArtist(10, search),
    refetchOnMount: "always",
  });
  const disableArtist = useMutation(disableSongs, {
    onSuccess: () => {
      toast.success("Artists Disabled");
      navigate("/admin");
    },
    onMutate: (variables) => {
      // Capture the previous data before the mutation
      const previousData = queryClient.getQueryData([
        "songs",
        variables.search,
      ]);
      return previousData;
    },
    onSettled: (data, error, variables) => {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries(["songs", variables.search]);
    },
  });

  const [selectedArtist, setSelectedArtist] = useState([]);

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError) {
    return <div>Error fetching audios</div>;
  }

  const toggleSongSelection = (songId) => {
    setSelectedArtist((prevSelectedArtist) => {
      if (prevSelectedArtist.includes(songId)) {
        return prevSelectedArtist.filter((id) => id !== songId);
      } else {
        return [...prevSelectedArtist, songId];
      }
    });
  };
  function disableSelectedArtist() {
    disableArtist.mutate(selectedArtist);
  }
  return (
    <>
      <ul className={styles.userul} style={{ paddingLeft: "0px" }}>
        {data?.artists?.map((song, index) => {
          const isSelected = selectedArtist.includes(song.name);
          return (
            <li
              key={song._id}
              className={`${styles.userlist} ${
                isSelected ? styles.selected : ""
              } ${song.isDisabled ? styles.disabled : ""}`}
              onClick={() => toggleSongSelection(song.name)}
            >
              <span className={styles.number}>{index + 1}.</span>
              <h1 className={styles.username}>{song.name}</h1>
              <h5 style={{ color: "white" }}>{song.isDisabled}</h5>
            </li>
          );
        })}
      </ul>
      <button
        className={styles.btn}
        style={{ width: "300px", marginTop: "5px", fontFamily: "Roboto" }}
        onClick={() => disableSelectedArtist()}
      >
        Change Selected Artist
      </button>
    </>
  );
}

export default DisableArtist;
