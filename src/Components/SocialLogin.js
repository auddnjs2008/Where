import React from "react";
import styled from "styled-components";
import KakaoLogin from "react-kakao-login";
import { authService, firebaseInstant } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const { Kakao } = window;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;

  button {
    outline: none;
    border: none;
    height: 30px;
    width: 400px;
    font-size: 18px;
    margin-top: 10px;
    border-radius: 10px;
  }

  button:nth-child(1) {
    background-color: rgba(138, 141, 146);
    span {
      font-size: 20px;
    }
  }
  button:nth-child(2) {
    background-color: rgba(193, 221, 134);
  }
`;

const GoogleBtn = styled.button`
  @keyframes marginMove {
    from {
      margin-top: 10px;
    }
    to {
      margin-top: 20px;
    }
  }

  animation: ${(props) =>
    props.error ? "marginMove 0.4s linear forwards" : ""};
`;

const KakaoBtn = styled(KakaoLogin)`
  width: 100%;
`;

const SocialLogin = ({ setError, error }) => {
  const socialLoginClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    try {
      if (name === "google") {
        provider = new firebaseInstant.auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstant.auth.GithubAuthProvider();
      }

      await authService.signInWithPopup(provider);
    } catch (error) {
      setError(error.message);
    }
  };

  const responseKakao = async (res) => {
    //localStorage.setItem("kakao", JSON.stringify(res));
    Kakao.Auth.setAccessToken(res.response.access_token);
    //우리는 파이어베이스 를 사용해야 되는데 카카오는 파이어베이스  로그인 정보가 없다.  => 따라서  구글 로그인으로 fake를 건다.
    const provider = new firebaseInstant.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider);
  };

  return (
    <SocialLoginWrapper>
      <GoogleBtn error={error} onClick={socialLoginClick} name={"google"}>
        <span style={{ color: "rgba(66,133,244)" }}>G</span>
        <span style={{ color: "rgba(234,67,53)" }}>o</span>
        <span style={{ color: "rgba(251,188,5)" }}>o</span>
        <span style={{ color: "rgba(66,133,244)" }}>g</span>
        <span style={{ color: "rgba(52,168,83)" }}>l</span>
        <span style={{ color: "rgba(234,67,53)", marginRight: "10px" }}>e</span>
        Login
      </GoogleBtn>
      <button onClick={socialLoginClick} name={"github"}>
        <FontAwesomeIcon
          icon={faGithub}
          style={{ marginRight: "10px" }}
        ></FontAwesomeIcon>
        GitHub Login
      </button>
      <KakaoBtn
        jsKey="e2a2fd82f5c318edfb424144be286f47"
        onSuccess={(result) => responseKakao(result)}
        onFailure={(error) => console.log(error)}
        getProfile={true}
      ></KakaoBtn>
    </SocialLoginWrapper>
  );
};

export default SocialLogin;
