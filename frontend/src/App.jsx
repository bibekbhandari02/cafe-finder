import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cafes from "./pages/Cafes";
import CafeDetail from "./pages/CafeDetail";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import AddCafe from "./pages/AddCafe";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes" element={<Cafes />} />
            <Route path="/cafes/:id" element={<CafeDetail />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-cafe"
              element={user ? <AddCafe /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
