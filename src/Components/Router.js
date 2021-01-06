import React, { useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Auth from "../Routes/Auth";
import Home from "../Routes/Home";
import MyPage from "../Routes/MyPage";

const AppRouter = ({ isLogIn, userObj, setUserObj }) => {
  return (
    <Router>
      {isLogIn ? (
        <>
          <Route exact path="/">
            <Home userObj={userObj} />
          </Route>
          <Route path="/mypage">
            <MyPage userObj={userObj} />
          </Route>
        </>
      ) : (
        <Route exact path="/">
          <Auth />
        </Route>
      )}
    </Router>
  );
};

export default AppRouter;
