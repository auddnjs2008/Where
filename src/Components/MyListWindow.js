import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import placeCode from "../placeCode";

const { kakao, Kakao } = window;

const ShowWindow = styled.ul``;

const ItemList = styled.li`
  button.display {
    display: none;
  }
`;

const MyListWindow = ({ map, places, setRoadViewObj, list }) => {
  const listItemClick = (e) => {
    const {
      target: { lastChild, innerText },
    } = e;
    let changeText;
    lastChild.classList.toggle("display");
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

  return (
    <ShowWindow>
      {list.length !== 0
        ? list.map((item) => (
            <ItemList onClick={listItemClick} key={item.id}>
              {item.place_name}
              <button id={item.id} onClick={shareBtnClick} className="display">
                공유
              </button>
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
