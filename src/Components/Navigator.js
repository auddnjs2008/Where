import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { authService } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";

const { Kakao } = window;

const Container = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-between;
  width: 500px;
  height: 50px;
  li,
  button {
    background-color: #f39c12;
    opacity: 0.7;
    width: 80px;
    height: 80px;
    border: 5px solid black;
    transition: all 0.5s linear;
    z-index: 100;
  }

  li:nth-child(1) {
    transform: rotate(-45deg);
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }

  li:nth-child(2) {
    transform: rotate(60deg);
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }

  button {
    border: 5px solid black;
    transform: rotate(150deg);
    outline: none;
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }
`;

const SLink = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Navigator = () => {
  const logoutBtnClick = async () => {
    // 파이어베이스 로그인과  카카오 톡 로그인 다 처리해준다.
    //1. 카카오톡 로그인 처리
    if (Kakao && Kakao.Auth.getAccessToken())
      Kakao.Auth.logout(() => console.log("로그아웃 성공"));

    await authService.signOut();
    window.location.href = "/";
  };

  return (
    <Container>
      <li>
        <SLink to="/">
          <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home
        </SLink>
      </li>
      <li>
        <SLink to="/mypage">
          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>MyPage
        </SLink>
      </li>
      <button onClick={logoutBtnClick}>Log Out</button>
    </Container>
  );
};

export default Navigator;
