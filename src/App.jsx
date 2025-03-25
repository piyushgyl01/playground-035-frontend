import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./components/OAuthCallback";
import Animes from "./pages/Animes";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import CreateAnime from "./pages/CreateAnime";
import EditAnime from "./pages/EditAnime";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <div>App</div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/success" element={<OAuthCallback />} />
          <Route path="/" element={<Animes />} />
          <Route path="/:animeId" element={<AnimeDetailsPage />} />
          <Route path="/create" element={<CreateAnime />} />
          <Route path="/edit/:animeId" element={<EditAnime />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}
