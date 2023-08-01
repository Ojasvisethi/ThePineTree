import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
import { toast } from "react-hot-toast";

function Player({ song, songList, dispatch }) {
  const audioName = song.songname;
  const songname = song.title;
  const genre = song.genre;
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(100);
  console.log(currentSongIndex, songList);
  useEffect(() => {
    const index = songList.songs.findIndex(
      (item) => item.songname === song.songname
    );
    if (index !== -1) {
      setCurrentSongIndex(index);
    }
  }, [song, songList]);

  const fetchAudioUrl = async (audioName) => {
    const response = await fetch(
      `http://localhost:3000/music/music/${encodeURIComponent(audioName)}`
    );
    if (!response.ok) {
      throw new Error("Error fetching audio");
    }
    return response.json();
  };

  const { data: audioUrlData, isError } = useQuery({
    queryKey: ["audioUrl", song], // queryKey includes the audioName to differentiate queries for different songs
    queryFn: () => fetchAudioUrl(audioName),
    onSuccess: () => {}, // Corrected spelling from onSucces to onSuccess
    enabled: !!audioName,
    refetchOnMount: false, // Corrected to boolean false instead of "false"
    refetchOnWindowFocus: false, // Corrected to boolean false instead of "false"
    refetchOnReconnect: false, // Corrected to boolean false instead of "false"
  });
  const audioRef = useRef();

  useEffect(() => {
    // Check if the audio is playing and if the audioName has changed
    // If so, pause the current audio and update the player to load and play the new audio
    console.log(audioRef.current.src, audioUrlData);
    if (
      audioRef.current &&
      audioRef.current.src !== audioUrlData &&
      audioRef.current.src !== ""
    ) {
      console.log(audioRef.current.src, audioUrlData);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
    }
  }, [audioName, isPlaying, audioUrlData]);

  useEffect(() => {
    // Reset the slider's position when the audioName prop changes
    setPercentage(0);
  }, [audioName]);

  useEffect(() => {
    // Check if the audioName has changed and if isPlaying is false
    // If so, play the audio automatically
    if (audioUrlData && isPlaying && audioRef.current.paused) {
      // setIsPlaying(true);
      audioRef.current.play();
    }
  }, [audioUrlData, isPlaying]);

  if (isError) {
    return <div>Error fetching audio</div>;
  }

  const onAudioEnded = () => {
    // When the current audio finishes, play the next song if available
    console.log(currentSongIndex, songList.songs[currentSongIndex]);
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songList.songs.length);
    dispatch({
      type: "Nextsong",
      payLoad: songList.songs[(currentSongIndex + 1) % songList.songs.length],
    });
  };

  const onChange = (e) => {
    console.log(e.target.value);
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * e.target.value;
    setPercentage(e.target.value);
  };

  const play = () => {
    const audio = audioRef?.current;
    if (audioName) {
      if (!isPlaying) {
        setIsPlaying(true);
        try {
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        }
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      toast.error("Please Select a song");
    }
  };

  const getCurrDuration = (e) => {
    // console.log(e.currentTarget.currentTime);
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    // const time = e.currentTarget.currentTime;

    setPercentage(+percent);
    // setCurrentTime(time.toFixed(2));
  };

  return (
    <>
      <Slider percentage={percentage} onChange={onChange}></Slider>
      <div className={styles.player_container}>
        <audio
          src={audioUrlData}
          ref={audioRef}
          onTimeUpdate={getCurrDuration}
          // onLoadedMetadata={(e) => {
          //   setDuration(e.currentTarget.duration.toFixed(2));
          // }}
          onEnded={onAudioEnded}
          // Call the pause function when the audio is paused
        />
        <div className={styles.sliderContain}>
          {songname && (
            <div className={styles.Name}>
              <div className={styles.dash}>
                <img src="/DASH.png" alt="dash"></img>
              </div>
              <div className={styles.namGen}>
                <span className={styles.songname}>{songname}</span>
                <span className={styles.genre}>Genre &gt; {genre}</span>
              </div>
            </div>
          )}
          <div className={styles.control}>
            <div style={{ alignSelf: "center" }} className={styles.btn}>
              <img
                style={{ height: "30px", width: "20px" }}
                src="/back.png"
                alt="back"
              ></img>
            </div>
            <div className={styles.btn} onClick={() => play()}>
              <img
                src={`${isPlaying ? "/Play.png" : "/Pause.png"}`}
                alt="play"
              ></img>
            </div>
            <div style={{ alignSelf: "center" }} className={styles.btn}>
              <img
                style={{ height: "30px", width: "20px" }}
                src="/Forward.png"
                alt="forward"
              ></img>
            </div>
          </div>
          <img src="/Sound.png" alt="Sound" className={styles.sound}></img>
          <input
            type="range"
            value={volume}
            onChange={(e) => {
              const newVolume = e.target.value;
              setVolume(newVolume);
              audioRef.current.volume = newVolume / 100;
            }}
            min="0"
            max="100"
            className={styles.volumeSlider}
          ></input>
        </div>
      </div>
    </>
  );
}

export default Player;

function Slider({ percentage = 0, onChange }) {
  console.log(percentage);
  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  // console.log(marginLeft);
  const rangeRef = useRef();
  const thumbRef = useRef();

  const isWindowFocused = useRef(true);

  useEffect(() => {
    // Function to handle focus change
    const handleFocusChange = () => {
      isWindowFocused.current = document.hasFocus();
    };

    // Attach event listeners for focus and blur
    window.addEventListener("focus", handleFocusChange);
    window.addEventListener("blur", handleFocusChange);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("focus", handleFocusChange);
      window.removeEventListener("blur", handleFocusChange);
    };
  }, []);

  useEffect(() => {
    if (isWindowFocused.current && !isNaN(percentage)) {
      const rangeWidth = rangeRef?.current?.getBoundingClientRect().width;
      const thumbWidth = thumbRef?.current?.getBoundingClientRect().width;
      const centerThumb = (thumbWidth / 100) * percentage * -1;
      const centerProgressBar =
        thumbWidth +
        (rangeWidth / 100) * percentage -
        (thumbWidth / 100) * percentage;

      setPosition(percentage);
      setMarginLeft(centerThumb);
      setProgressBarWidth(centerProgressBar);
    }
  }, [percentage]);

  return (
    <div className={styles.sliderContainer}>
      <div
        className={styles.progressBarCover}
        style={{
          width: `${progressBarWidth}px`,
        }}
      ></div>
      <div
        className={styles.thumb}
        ref={thumbRef}
        style={{
          left: `${position}%`,
          marginLeft: `${marginLeft}px`,
        }}
      ></div>
      <input
        type="range"
        value={position}
        ref={rangeRef}
        step="0.01"
        className={styles.range}
        onChange={onChange}
      />
    </div>
  );
}
