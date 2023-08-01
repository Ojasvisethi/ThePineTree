import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./AddGenreOrArtist.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const addGenreOrArtistMutation = async ({ type, name }) => {
  try {
    const response = await fetch("http://localhost:3000/music/addGenOrArt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, name }),
    });

    if (!response.ok) {
      throw new Error("Failed to add genre or artist");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error adding genre or artist");
  }
};

function AddGenreOrArtist() {
  const [type, setType] = useState("genre");
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(addGenreOrArtistMutation, {
    // Optional: If mutation is successful, invalidate the query that lists genres or artists
    onSuccess: () => {
      queryClient.invalidateQueries("genresOrArtists");
      toast.success("Added Successfully");
      setName("");
      // You can add additional actions here after a successful mutation if needed
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleAddGenreOrArtist = () => {
    mutation.mutate({ type, name });
  };

  return (
    <div className={styles.GenAr}>
      <h1 style={{ fontSize: "2.7rem" }}>Add Genre or Artist</h1>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/admin")}
      ></FaArrowLeft>
      <div className={styles.upfile}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          id="name"
        />
      </div>
      <div className={styles.upfile}>
        <label htmlFor="type">Type</label>
        <select
          placeholder="Enter Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.input}
          id="type"
        >
          <option value={"genre"}>Genre</option>
          <option value={"artist"}>Artist</option>
        </select>
      </div>
      <button onClick={handleAddGenreOrArtist} className={styles.btnGen}>
        ADD {type.toUpperCase()}
      </button>
    </div>
  );
}

export default AddGenreOrArtist;
