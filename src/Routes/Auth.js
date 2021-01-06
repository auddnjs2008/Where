import React, { useState } from "react";
import styled from "styled-components";
import EmailLogin from "../Components/EmailLogin";
import SocialLogin from "../Components/SocialLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 500px;
  height: 550px;
  margin: 0 auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(15, 15, 15, 0.8);
`;

const Error = styled.div`
  width: 400px;
  padding: 10px;
  color: red;

  @keyframes error {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  animation: error 0.5s linear;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Auth = () => {
  const [error, setError] = useState(null);

  return (
    <Container>
      <TitleWrapper>
        <FontAwesomeIcon
          icon={faMapSigns}
          style={{
            width: "50px",
            height: "50px",
            color: "#f39c12",
            marginRight: "10px",
          }}
        ></FontAwesomeIcon>
        <h1>Where</h1>
      </TitleWrapper>
      <EmailLogin setError={setError}></EmailLogin>
      {error ? <Error>{error}</Error> : ""}
      <SocialLogin setError={setError} error={error}></SocialLogin>
    </Container>
  );
};

export default Auth;
