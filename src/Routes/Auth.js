import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService, firebaseInstant } from "../firebase";



const Form = styled.form``;

const SocialLogin = styled.div``;


const Auth =() =>{

    const [email,setEmail] =useState();
    const [password,setPassword]=useState();
    const [newUser,setNewUser]=useState(false);
    const [error,setError] = useState("");
    const onSubmit =async (e)=>{
        e.preventDefault();
        let user
        try{
        if(newUser){
            // 계정 생성을 해준다.
            user =  await authService.createUserWithEmailAndPassword(email,password);
    
        }else{  
            // 로그인을 해준다.
            user = await authService.signInWithEmailAndPassword(email,password);
        }
        } catch(error){
           setError(error);
        }
    }


    const onChange=(e) =>{
        const {target :{name,value}}=e;
        if(name === "email"){
            setEmail(value);
        }else if(name==="password"){
            setPassword(value);
        }
    }

    const socialLoginClick =async (e)=>{
        const {target:{name}}=e;
        let provider;
        try{
        if(name === "google"){
            provider = new firebaseInstant.auth.GoogleAuthProvider();

        }else if(name==="github"){
             provider =new firebaseInstant.auth.GithubAuthProvider();
        }

        const data = await authService.signInWithPopup(provider);
        }catch(error){
            setError(error);
        }
    }
    


    const toggleBtnClick =() => setNewUser(prev => !prev);

    return (<>
            <Form onSubmit={onSubmit}>
                <input onChange={onChange} name="email"  type="email" placeholder="What is your Email?"/>
                <input onChange={onChange} name="password" type="password" placeholder="Password"/>
                <input type="submit" value={newUser ? "Create" : "Log In"}/>
            </Form>
            <button onClick={toggleBtnClick}>{newUser ? "Sign In" : "Create"}</button>
            <div>{error}</div>
            <SocialLogin>
                <button onClick={socialLoginClick} name={"google"}>Google Login</button>
                <button onClick={socialLoginClick} name={"github"}>GitHub Login</button>
            </SocialLogin>
        </>
    )
}

export default Auth;