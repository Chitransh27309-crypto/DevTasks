import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
        <Route path="/projects" element={<h1>Projects Page</h1>} />
        <Route path="/projects/:id" element={<h1>Project Details Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
