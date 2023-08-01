import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Pages/Login";
import Homepage from "./Pages/Homepage";
import AppLayout from "./Pages/AppLayout";
import Search from "./Pages/Search";
import { Toaster } from "react-hot-toast";
import Mail from "./Component/Mail";
import AuthProvider from "./Context/AuthContext";
import Songs from "./Pages/Songs";
import ProtectedRoute from "./UI/ProtectedRoute";
import Admin from "./Component/Admin/Admin";
import SongProvider from "./Context/SongContext";
import Profile from "./UI/Profile";
import UploadSong from "./Component/Admin/UploadSong";
import AdminMainPage from "./Component/Admin/AdminMainPage";
import NewUser from "./Component/Admin/NewUser";
import DisableArtist from "./Component/Admin/DisableArtist";
import AddGenreOrArtist from "./Component/Admin/AddGenreOrArtist";
import ChangeUser from "./Component/Admin/ChangeUser";
import DisableSong from "./Component/Admin/DisableSong";
import EnableSong from "./Component/Admin/EnableSong";
import EnableArtist from "./Component/Admin/EnableArtist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SongProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage></Homepage>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout></AppLayout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="search" />} />
                <Route path="search" element={<Search></Search>}></Route>
                <Route path="mails" element={<Mail></Mail>}></Route>
                <Route path="songs" element={<Songs></Songs>}></Route>
                <Route path="profile" element={<Profile></Profile>}></Route>
              </Route>
              <Route path="admin" element={<Admin></Admin>}>
                <Route index element={<Navigate replace to="main" />} />
                <Route
                  path="main"
                  element={<AdminMainPage></AdminMainPage>}
                ></Route>
                <Route
                  path="uploadSong"
                  element={<UploadSong></UploadSong>}
                ></Route>
                <Route path="NewUser" element={<NewUser></NewUser>}></Route>
                <Route
                  path="DisableArt"
                  element={<DisableArtist></DisableArtist>}
                ></Route>
                <Route
                  path="EnableArt"
                  element={<EnableArtist></EnableArtist>}
                ></Route>
                <Route
                  path="AddGenOrArt"
                  element={<AddGenreOrArtist></AddGenreOrArtist>}
                ></Route>
                <Route
                  path="ChangeUser"
                  element={<ChangeUser></ChangeUser>}
                ></Route>
                <Route
                  path="DisableSong"
                  element={<DisableSong></DisableSong>}
                ></Route>
                <Route
                  path="EnableSong"
                  element={<EnableSong></EnableSong>}
                ></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </SongProvider>
      </AuthProvider>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "black",
            fontFamily: "sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
