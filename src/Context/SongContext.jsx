import { createContext, useContext, useReducer } from "react";

const SongContext = createContext();

const initialState = {
  song: null,
  songList: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SetSong":
      console.log(action.payLoad);
      return {
        ...state,
        song: action.payLoad.song,
        songList: action.payLoad.songList,
      };
    case "Nextsong":
      console.log("hell", action.payLoad);
      return { ...state, song: action.payLoad };
    default:
      throw new Error("loading Song Error");
  }
}

export default function SongProvider({ children }) {
  const [{ song, songList }, dispatch] = useReducer(reducer, initialState);
  // function setSong(song, songList) {}
  return (
    <SongContext.Provider value={{ dispatch, song, songList }}>
      {children}
    </SongContext.Provider>
  );
}

function useSong() {
  const context = useContext(SongContext);
  if (context === undefined)
    throw new Error("Context used outside context Provider");

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useSong };
