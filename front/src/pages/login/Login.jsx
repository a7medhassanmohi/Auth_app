import React from "react";
import "./login.scss";
import { BsGoogle } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";

function Login({ user, setuser }) {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    axios
      .post(`${process.env.REACT_APP_BASEURL}/normalauth/google`, {
        tokenId: response.tokenId,
        googleId: response.googleId,
      })
      .then((res) => {
        localStorage.setItem("googletoken", JSON.stringify(res.data.token));
        toast.success("login sucess", {
          position: "bottom-center",
        });
        setuser(res.data.user);
      })
      .catch((e) => {
        console.log(e.response.data.mess);
      });
  };
  const responseFaile = (response) => {
    console.log(response);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, onsubmit) => {
      // console.log(values);
      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/login`, values)
        .then((res) => {
          setuser(res.data.user);
          localStorage.setItem("token", JSON.stringify(res.data.token));
          toast.success("login Success", {
            position: "bottom-center",
          });
        })
        .catch((e) => {
          console.log(e.response.data.mess);
          toast.warn(e.response.data.mess, {
            position: "bottom-center",
          });
        });
      onsubmit.resetForm();
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("require valid email")
        .required("email is require"),
      password: yup.string().required("Password is required"),
    }),
  });
  if (user) {
    navigate("/");
  }
  return (
    <div className="login">
      <div className="logincontent">
        <div className="form">
          <div className="content_">
            <h5>Login</h5>
            <form action="" onSubmit={formik.handleSubmit}>
              <div className="item">
                <AiOutlineMail />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  {...formik.getFieldProps("email")}
                />
              </div>
              <div className="item">
                <RiLockPasswordLine />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  {...formik.getFieldProps("password")}
                />
              </div>
              <span>
                <Link to="/forget">Forget Password?</Link>
              </span>
              <button type="submit">Login</button>
              <div className="errors">
                {formik.touched.email && formik.errors.email ? (
                  <div> {formik.errors.email} </div>
                ) : null}
                {formik.touched.password && formik.errors.password ? (
                  <div> {formik.errors.password} </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        <div className="google">
          <div className="content_">
            <GoogleLogin
              clientId="818917350917-m2i93e7sgs46636m5t05pmd3r45b7nin.apps.googleusercontent.com"
              buttonText="Login With Google"
              onSuccess={responseGoogle}
              onFailure={responseFaile}
              cookiePolicy={"single_host_origin"}
              prompt="select_account"
            />
            ,
            {/* <button onClick={googleLogin}>
              <BsGoogle />
              Login With Google
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
