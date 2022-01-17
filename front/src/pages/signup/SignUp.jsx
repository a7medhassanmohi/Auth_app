import React from "react";
import "./signup.scss";
import { BsGoogle } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";

function SignUp({ user, setuser }) {
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
      username: "",
      email: "",
      password: "",
      conformpassword: "",
    },
    onSubmit: (values, onsubmit) => {
      const user = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/register`, user)
        .then((res) => {
          console.log(res.data.mess);
          toast.success(res.data.mess, {
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
      username: yup.string().required("username require"),
      password: yup.string().required("Password is required"),
      conformpassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
  });
  // const googleLogin = () => {
  //   window.open(`${process.env.REACT_APP_BASEURL}/auth/google`, "_self");
  // };
  return (
    <div className="signup">
      <div className="signupcontent">
        <div className="form">
          <div className="content_">
            <h5>Sign Up</h5>
            <form action="" onSubmit={formik.handleSubmit}>
              <div className="item">
                <AiOutlineUser />
                <input
                  type="text"
                  placeholder="UserName"
                  name="username"
                  {...formik.getFieldProps("username")}
                />
              </div>
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
              <div className="item">
                <RiLockPasswordLine />
                <input
                  type="password"
                  placeholder="Conform Password"
                  name="conformpassword"
                  {...formik.getFieldProps("conformpassword")}
                />
              </div>
              <button type="submit">Sign Up</button>
              <div className="errors">
                {formik.touched.username && formik.errors.username ? (
                  <div> {formik.errors.username} </div>
                ) : null}
                {formik.touched.email && formik.errors.email ? (
                  <div> {formik.errors.email} </div>
                ) : null}
                {formik.touched.password && formik.errors.password ? (
                  <div> {formik.errors.password} </div>
                ) : null}
                {formik.touched.conformpassword &&
                formik.errors.conformpassword ? (
                  <div> {formik.errors.conformpassword} </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
