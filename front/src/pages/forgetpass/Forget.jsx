import React, { useEffect, useState } from "react";
import "./forget.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Forget() {
  const [email, setemail] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    if (email.length > 0) {
      // console.log(email);
      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/forget`, { email })
        .then((res) => {
          console.log(res.data.mess);
          toast.success(res.data.mess, {
            position: "bottom-center",
          });
          setemail("");
        })
        .catch((e) => {
          console.log(e.response.data.mess);
          toast.warning(e.response.data.mess, {
            position: "bottom-center",
          });
        });
    }
  };
  return (
    <div className="forget">
      <div className="content">
        <h2>Forget Password</h2>
        <form action="" onSubmit={onSubmit}>
          <div className="item">
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
          </div>
          <button type="submit">sent</button>
        </form>
        <p style={{ fontSize: "11px", margin: "10px 0" }}>
          Check your email address inbox
        </p>
      </div>
    </div>
  );
}

export default Forget;
