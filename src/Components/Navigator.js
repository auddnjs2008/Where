import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


const Container =styled.ul``;

const SLink=styled(Link)``;



const Navigator = () =>{
    return(
    <Container>
        <li><SLink to="/">Home</SLink></li>
        <li><SLink to="/mypage">MyPage</SLink></li>
    </Container>
    )
}

export default Navigator;