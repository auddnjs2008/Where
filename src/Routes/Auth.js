import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService, firebaseInstant } from "../firebase";
import KaKaoLogin from "react-kakao-login";
import KakaoLogin from "react-kakao-login";

const {Kakao}=window;

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
            
        await authService.signInWithPopup(provider);    
        }catch(error){
            setError(error);
        }
    }
    
    // const kakaoLogin = ()=>{
     
    //     Kakao.Auth.login({
    //         success: (auth) => 
    //         fail:(error) => console.log(error)
    //     })
    // }

    const responseKakao = (res) =>{
        localStorage.setItem("kakao",JSON.stringify(res));
        Kakao.Auth.setAccessToken(res.response.access_token);
        Kakao.API.request({
            url:'/v1/api/talk/friends',
            success: (response) => console.log(response),
            fail: (error) => console.log(error)
        })
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
                <KakaoLogin 
                    jsKey="e2a2fd82f5c318edfb424144be286f47"
                    onSuccess={(result) => responseKakao(result)}
                    onFailure={error => console.log(error)}
                    getProfile={true} 
                ></KakaoLogin>
            </SocialLogin>
        </>
    )
}

export default Auth;