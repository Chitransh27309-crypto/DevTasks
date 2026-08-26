import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><h1>Dashboard Page</h1></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><h1>Projects Page</h1></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><h1>Project Details Page</h1></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
