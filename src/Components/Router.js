import React, { useState } from "react";
import {HashRouter as Router,Redirect,Route,Switch} from "react-router-dom";
import Auth from "../Routes/Auth";
import Home from "../Routes/Home";



const AppRouter =({isLogIn, userObj}) =>{

    return (
        <Router>
            {isLogIn ?
            <Route exact path="/">
                <Home />
            </Route>
            :<Route exact path="/"><Auth/></Route>}
        </Router>
    )
}

export default AppRouter;