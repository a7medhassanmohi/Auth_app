import React from "react";
import "./home.scss";

function Home({ user }) {
  return (
    <div className="home">
      <div className="content">
        <h1>Home</h1>
        <div className="user">
          <div className="name">
            <h4>
              <span>Welcome :</span> {user && user.username}{" "}
            </h4>
          </div>
          <div className="email">
            <h4>
              <span>Email :</span> {user && user.email}{" "}
            </h4>
          </div>
          <div className="verifyed">
            <h4>
              <span>Account :</span>
              {user && user.isverify ? "verfied" : "Not verfied"}{" "}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
