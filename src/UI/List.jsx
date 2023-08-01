import { useSong } from "../Context/SongContext";
import styles from "./List.module.css";

function List({ audio, handleSong }) {
  const { song } = useSong();
  const playing = song?.title === audio?.title ? "Playing Now..." : "Play Song";
  return (
    <div
      onClick={() => handleSong(audio)}
      className={styles.SongSection}
      style={
        song?.title === audio?.title ? { backgroundColor: "#adf8e1" } : null
      }
    >
      <div className={styles.NamAr}>
        <span>{audio.title}</span>
        <span>{audio.artist}</span>
      </div>
      <div
        style={{
          height: "10px",
          width: "10px",
          backgroundColor: "#939393",
          borderRadius: "50%",
          margin: "0px 10px",
        }}
      ></div>
      <div className={styles.NamAr}>
        <span>{audio.genre}</span>
        <button className={styles.showAll}>{playing}</button>
      </div>
    </div>
  );
}

export default List;
