import React, { useEffect, useState } from "react";
import "./activate.scss";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ActivateAccount() {
  const { token } = useParams();
  const [mess, setmess] = useState("");

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BASEURL}/normalauth/activate`, { token })
      .then((res) => {
        console.log(res.data.mess);
        setmess(res.data.mess);
      })
      .catch((e) => {
        console.log(e.response.data.mess);
        setmess(e.response.data.mess);
      });
  }, []);
  return (
    <div className="activate">
      <div className="content">
        <div className="message">{mess.length > 0 ? mess : null}</div>
        <Link to="/login"> go to login </Link>
      </div>
    </div>
  );
}

export default ActivateAccount;
