import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import Register from "./pages/Register";
import Cafes from "./pages/Cafes";
import CafeDetail from "./pages/CafeDetail";
import MapSearch from "./pages/MapSearch";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AddCafe from "./pages/AddCafe";
import EditCafe from "./pages/EditCafe";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-xl dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes" element={<Cafes />} />
            <Route path="/cafes/:id" element={<CafeDetail />} />
            <Route path="/map" element={<MapSearch />} />
            
            {/* User Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" replace />}
            />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                user?.isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/add-cafe"
              element={
                user?.isAdmin ? (
                  <AddCafe />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/edit-cafe/:id"
              element={
                user?.isAdmin ? (
                  <EditCafe />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
