import React from "react";
import "./newpassword.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewPassword() {
  const { token } = useParams();
  const formik = useFormik({
    initialValues: {
      password: "",
      conformpassword: "",
    },
    onSubmit: (values, onsubmit) => {
      const data = { token, password: values.password };
      axios
        .post(`${process.env.REACT_APP_BASEURL}/normalauth/rest`, data)
        .then((res) => {
          toast.success(res.data.mess, {
            position: "bottom-center",
          });
        })
        .catch((e) => {
          toast.warn(e.response.data.mess, {
            position: "bottom-center",
          });
        });

      onsubmit.resetForm();
    },
    validationSchema: yup.object({
      password: yup.string().required("Password is required"),
      conformpassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
  });
  return (
    <div className="newpassword">
      <div className="content">
        <h2>Set New passsword</h2>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="item">
            <input
              type="password"
              placeholder="your new password"
              name="password"
              {...formik.getFieldProps("password")}
            />
          </div>
          <div className="item">
            <input
              type="password"
              placeholder="your new password again"
              name="conformpassword"
              {...formik.getFieldProps("conformpassword")}
            />
          </div>
          <button type="submit">submit</button>
        </form>
        <div className="errors">
          {formik.touched.password && formik.errors.password ? (
            <div> {formik.errors.password} </div>
          ) : null}
          {formik.touched.conformpassword && formik.errors.conformpassword ? (
            <div> {formik.errors.conformpassword} </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
