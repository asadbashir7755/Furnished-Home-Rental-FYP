import { Routes, Route } from "react-router-dom";
import Home from "./User/MainPages/Home";
import Contactus from "./User/Components/Contactus";
import Login from "./User/UserAuth/LoginPage";
import Dashboard from "./Admin/Dashboard";
import ManageItems from "./Admin/ManageItems";
import ProtectedRoute from "./User/Auth/protectedroute";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<Contactus />} />
        {/* verification */}
        <Route path="/login" element={<Login />} />
        {/* Admin */}
        {/* <Route path="/Dashboard" element={<Dashboard/>} /> */}
        {/* <Route path="/ManageItems" element={<ManageItems/>} /> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ManageItems" element={<ManageItems/>} />
        </Route>




      </Routes>
    </>
  );
}

export default App;