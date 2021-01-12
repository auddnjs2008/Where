import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import placeCode from "../placeCode";

const { Kakao } = window;

const Container = styled.ul`
  position: absolute;
  padding: 0;
  padding: 10px;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 330px;
  height: 330px;
  background-color: white;
  display: none;
  border-radius: 10px;
`;
const FormWrapper = styled.form`
  border: 2px solid #f39c12;
  height: 200px;
  overflow: auto;
`;
const List = styled.li`
  list-style: none;
`;
const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;
  text-align: center;
  button,
  input[type="submit"] {
    all: unset;
    font-size: 15px;
    box-shadow: 0px 1px 2px rgba(25, 25, 25, 0.5);
    margin-left: 10px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: #34495e;
    color: white;
    padding: 2px;
    &:active {
      transform: scale(0.9, 0.9);
    }
  }
`;
const Error = styled.div`
  color: red;
  position: absolute;
  width: 100%;
  bottom: 10px;
  left: 23%;
`;

const MyListPackShare = ({ packShare, places }) => {
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    let testArray = [];
    // 메세지 최대 개수가 3개이므로 설정해주어야 한다.
    document.getElementsByName("index").forEach((item, index) => {
      if (item.checked) {
        testArray.push({
          ...places[index],
          imageUrl: places[index].category_group_code
            ? placeCode[places[index].category_group_code].url
            : placeCode["PS3"].url,
        });
      }
    });

    testArray = testArray.map((item) => {
      return {
        title: item.place_name,
        imageUrl: item.imageUrl,
        imageWidth: 50,
        imageHeight: 50,
        link: { webUrl: item.place_url },
      };
    });

    if (testArray.length < 2 || testArray.length > 3)
      setError("You should check 2~3 boxes");
    else setError("");
    sendMessage(testArray);
  };

  const sendMessage = (places) => {
    Kakao.Link.sendDefault({
      objectType: "list",
      headerLink: { webUrl: "https://wizardly-hopper-833bfb.netlify.app" },
      headerTitle: "장소 공유 리스트",
      contents: places,
      buttons: [
        {
          title: "상세보기",
          link: {
            mobileWebUrl: "https://wizardly-hopper-833bfb.netlify.app", // 추후 수정 필요
          },
        },
      ],
    });
  };

  const closeClick = (e) => {
    e.preventDefault();
    packShare.current.style.display = "none";
    setError("");
  };

  return (
    <Container ref={packShare}>
      {places.length !== 0 ? (
        <h4>최소 2개 최대 3개까지 선택하실 수 있습니다</h4>
      ) : (
        ""
      )}
      <FormWrapper onSubmit={onSubmit}>
        {places.length !== 0
          ? places.map((item, index) => (
              <List key={index}>
                <label>
                  <input type="checkbox" name="index" value={index} />
                  {item.place_name}
                </label>
              </List>
            ))
          : ""}
        {places.length !== 0 ? (
          <ButtonWrapper>
            <input className="submit" type="submit" value="공유" />
            <button onClick={closeClick}> 닫기</button>
          </ButtonWrapper>
        ) : (
          ""
        )}
      </FormWrapper>
      {error !== "" ? <Error>{error}</Error> : ""}
    </Container>
  );
};

export default MyListPackShare;

MyListPackShare.propTypes = {
  packShare: PropTypes.object,
  places: PropTypes.array,
};
