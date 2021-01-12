import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { authService } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";

const { Kakao } = window;

const Container = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: ${(props) => (props.size < 600 ? "column" : "row")};
  justify-content: ${(props) => (props.size < 600 ? "end" : "space-between")};
  width: ${(props) => (props.size < 600 ? "50%" : "50%")};
  height: 50px;
  margin-top: ${(props) => (props.size < 600 ? "50px" : "")};
  margin-left: ${(props) => (props.size < 600 ? "-40px" : "")};
  li,
  button {
    background-color: #f39c12;
    opacity: 0.7;
    width: ${(props) => (props.size < 600 ? "50px" : "80px")};
    height: ${(props) => (props.size < 600 ? "50px" : "80px")};
    border: 5px solid black;
    transition: all 0.5s linear;
    z-index: 3;
    color: red;
    font-weight: 700;
    font-size: ${(props) => (props.size < 600 ? "15px" : "20px")};
  }

  li:nth-child(1) {
    transform: ${(props) => (props.size < 600 ? "" : "rotate(-45deg)")};
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }

  li:nth-child(2) {
    transform: ${(props) => (props.size < 600 ? "" : "rotate(60deg)")};
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }

  button {
    border: 5px solid black;
    transform: ${(props) => (props.size < 600 ? "" : "rotate(150deg)")};
    outline: none;
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }
`;

const SLink = styled(Link)`
  display: flex;
  height: 80%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  padding: 10px;
  color: red;
  font-weight: 600;
`;

const Navigator = () => {
  const [size, setWindow] = useState(window.innerWidth);
  const logoutBtnClick = async () => {
    // 파이어베이스 로그인과  카카오 톡 로그인 다 처리해준다.
    //1. 카카오톡 로그인 처리
    if (Kakao && Kakao.Auth.getAccessToken())
      Kakao.Auth.logout(() => console.log("로그아웃 성공"));

    await authService.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWindow(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWindow(window.innerWidth));
  }, []);

  return (
    <Container size={size}>
      <li size={size}>
        <SLink to="/">
          <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home
        </SLink>
      </li>
      <li size={size}>
        <SLink to="/mypage">
          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>MyPage
        </SLink>
      </li>
      <button size={size} onClick={logoutBtnClick}>
        Log Out
      </button>
    </Container>
  );
};

export default Navigator;
