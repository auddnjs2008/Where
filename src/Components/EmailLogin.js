import React, { useState } from "react";

import styled from "styled-components";
import { authService } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  input[type="email"],
  input[type="password"] {
    outline: none;
    border: none;
    background-color: #b2bec3;
    border-radius: 10px;
    color: white;
    height: 30px;
    width: 400px;
    margin-bottom: 10px;
    padding: 5px;
    font-size: 20px;

    &::placeholder {
      color: white;
      font-size: 20px;
    }
  }

  input[type="submit"] {
    outline: none;
    border: none;
    border-radius: 20px;
    height: 30px;
    width: 400px;
    margin-top: 10px;
  }
`;

const ToggleBtn = styled.button`
  border-radius: 20px;
  border: none;
  outline: none;
  height: 30px;
  width: 400px;
  margin-top: 5px;
  margin-bottom: 30px;
`;

const EmailLogin = ({ setError }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [newUser, setNewUser] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    let user;
    // 제출을 하고 비워준다.
    const inputs = e.target.querySelectorAll("input");
    inputs[0].value = "";
    inputs[1].value = "";

    try {
      if (newUser) {
        // 계정 생성을 해준다.
        user = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // 로그인을 해준다.
        user = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const toggleBtnClick = () => setNewUser((prev) => !prev);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          name="email"
          type="email"
          placeholder="What is your Email?"
        />
        <input
          onChange={onChange}
          name="password"
          type="password"
          placeholder="Password"
        />
        <input type="submit" value={newUser ? "Create" : "Log In"} />
      </Form>
      <ToggleBtn onClick={toggleBtnClick}>
        {newUser ? "Sign In" : "Create"}
      </ToggleBtn>
    </>
  );
};

export default EmailLogin;
