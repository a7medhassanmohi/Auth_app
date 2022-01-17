import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home/Home";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./pages/nav/Nav";
import ActivateAccount from "./pages/activateacount/ActivateAccount";
import Forget from "./pages/forgetpass/Forget";
import NewPassword from "./pages/forgetpass/NewPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setuser] = useState(null);
  let localstorage = JSON.parse(localStorage.getItem("token"));
  let googlelocalstorage = JSON.parse(localStorage.getItem("googletoken"));

  useEffect(() => {
    if (localstorage) {
      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/login/sucess`, {
          token: localstorage,
        })
        .then((res) => {
          setuser(res.data.mess);
        })
        .catch((e) => {
          console.log(e.response.data.mess);
        });
    } else if (googlelocalstorage) {
      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/google/sucess`, {
          token: googlelocalstorage,
        })
        .then((res) => {
          setuser({
            username: res.data.user.username,
            email: res.data.user.email,
            isverify: res.data.user.isverify,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  if (location.pathname == "/Auth-app/") {
    navigate("/login");
  }
  return (
    <div className="App">
      <Nav setuser={setuser} user={user} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home setuser={setuser} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <Login setuser={setuser} user={user} />
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <SignUp setuser={setuser} user={user} />
            )
          }
        />
        <Route path="/activateaccount/:token" element={<ActivateAccount />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/newpassword/:token" element={<NewPassword />} />
      </Routes>
    </div>
  );
}

export default App;
