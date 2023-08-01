import { useEffect, useState } from "react";
import styles from "./UploadSong.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGenreAndArtist } from "../../Pages/Search";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UploadSong() {
  const [audio, setAudio] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setgenre] = useState("");
  const navigate = useNavigate();

  const {
    data: data,
    isLoading: isLoadingGenArt,
    isError: isErrorGenArt,
  } = useQuery({
    queryKey: ["audio"], // Include page and pageSize in the query key
    queryFn: getGenreAndArtist, // Pass page and pageSize to the query function
  });

  useEffect(() => {
    // Check if the 'data' variable is defined and 'data.artists' has items
    if (data && data.artists && data.artists.length > 0 && !artist) {
      setArtist(data.artists[0].name);
    }

    // Check if the 'data' variable is defined and 'data.genres' has items
    if (data && data.genres && data.genres.length > 0 && !genre) {
      setgenre(data.genres[0].name);
    }
  }, [data, artist, genre]);

  const uploadFile = async () => {
    const data = {
      audio: {
        name: audio.name,
        contentType: audio.type,
      },
      title: title,
      artist: artist,
      genre: genre,
    };

    const response = await fetch("http://localhost:3000/music/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error uploading files.");
    }

    const responseData = await response.json();
    const audioPresignedUrl = responseData.audio.url;

    // Upload the audio file to S3
    await fetch(audioPresignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": audio.type,
      },
      body: audio,
    });

    // Files uploaded successfully
  };

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success("File uploaded successfully.");
      navigate("/admin");
      // Do something with the uploaded data if needed
    },
    onError: (error) => {
      toast.error("An error occurred during file upload.");
      console.error("Error uploading files:", error);
    },
  });

  const handleAudioChange = (event) => {
    setAudio(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log(artist, genre);
    if (!audio || !title || !artist || !genre) {
      toast.error("Please fill in all fields.");
      return;
    }

    mutation.mutate();
  };
  if (isLoadingGenArt) {
    return <div>Loading...</div>;
  }

  if (isErrorGenArt) {
    return <div>Error fetching audios</div>;
  }

  return (
    <div className={styles.form}>
      <FaArrowLeft
        className={styles.backDash}
        onClick={() => navigate("/admin")}
      ></FaArrowLeft>
      <h1 style={{ fontSize: "5rem" }}>Upload</h1>
      <div className={styles.upfile}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Enter name of audio file"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          id="name"
        />
      </div>
      <div className={styles.upfile}>
        <label htmlFor="artist">Artist</label>
        <select
          type="text"
          placeholder="Enter Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className={styles.input}
          id="artist"
        >
          {data.artists.map((art) => (
            <option key={art._id} value={art.name}>
              {art.name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.upfile}>
        <label htmlFor="genre">Genre</label>
        <select
          type="text"
          placeholder="Enter Genre"
          value={genre}
          onChange={(e) => setgenre(e.target.value)}
          className={styles.input}
          id="genre"
        >
          {data.genres.map((gen) => (
            <option key={gen._id} value={gen.name}>
              {gen.name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.upfile}>
        <label htmlFor="audio">Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          className={styles.input}
          id="audio"
        />
      </div>
      <button
        onClick={handleUpload}
        className={styles.btn}
        disabled={mutation.isLoading}
      >
        Upload
      </button>
    </div>
  );
}

export default UploadSong;
