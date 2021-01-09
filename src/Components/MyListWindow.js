import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import placeCode from "../placeCode";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";

const { kakao, Kakao } = window;

const ShowWindow = styled.ul`
  list-style: none;
  background-color: white;
  padding: 5px;
  width: 250px;
  height: 243px;
  overflow: auto;
`;

const ItemList = styled.li`
  margin-bottom: 20px;
  button.display {
    display: none;
  }
`;

const ButtonWrapper = styled.div``;

const MyListWindow = ({
  userObj,
  map,
  places,
  setPlaces,
  setRoadViewObj,
  list,
}) => {
  const listItemClick = (e) => {
    const {
      target: { lastChild, innerText },
    } = e;
    let changeText;

    //리스트를 클릭하는 순간 지도 중심점 이동
    innerText.includes("공유")
      ? (changeText = innerText.split("공유")[0])
      : (changeText = innerText);
    const [target] = places.filter((item) => item.place_name === changeText);
    const movePoint = new kakao.maps.LatLng(target.y, target.x);
    map.setLevel(3);
    map.setCenter(movePoint);
    const center = document.querySelector("#map").firstChild;
    center.style.display = "block";
    setTimeout(() => {
      center.style.display = "none";
    }, 4000);
    setRoadViewObj(target);
  };

  const sendMessage = (address, title, imageUrl) => {
    Kakao.Link.sendDefault({
      objectType: "location",
      address,
      addressTitle: title,
      content: {
        title: "장소 공유",
        description: title,
        imageUrl,
        link: {
          webUrl: "https://developers.kakao.com", // 추후 수정 필요
        },
      },
      buttons: [
        {
          title: "웹으로 이동",
          link: {
            mobileWebUrl: "https://developers.kakao.com", // 추후 수정 필요
          },
        },
      ],
    });
  };

  const shareBtnClick = (e) => {
    e.stopPropagation();
    const {
      target: { id },
    } = e;
    const [place] = places.filter((item) => item.id === id);
    //친구한테 공유를 해줘야한다.
    //test

    sendMessage(
      place.address_name,
      place.place_name,
      placeCode[place.category_group_code].url
    );
  };

  const deleteBtnClick = async (e) => {
    e.stopPropagation();
    const newList = [];
    const object = await storeService
      .collection(`where-${userObj.uid}`)
      .get(queryAllByAttribute);
    object.forEach((item) => {
      if (item.data().id === e.target.id) {
        item.ref.delete();
      } else {
        newList.push(item.data());
      }
    });

    setPlaces(newList);
    // 화면을 사라져줘야 한다. 페이크로라도
  };

  return (
    <ShowWindow>
      {list.length !== 0
        ? list.map((item) => (
            <ItemList onClick={listItemClick} key={item.id}>
              {item.place_name}
              <ButtonWrapper>
                <button id={item.id} onClick={shareBtnClick}>
                  공유
                </button>
                <button id={item.id} onClick={deleteBtnClick}>
                  삭제
                </button>
              </ButtonWrapper>
            </ItemList>
          ))
        : ""}
    </ShowWindow>
  );
};

export default MyListWindow;

MyListWindow.propTypes = {
  map: PropTypes.object,
  places: PropTypes.array,
  setRoadObj: PropTypes.func,
  list: PropTypes.array,
};
