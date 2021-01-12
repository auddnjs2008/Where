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
  .empty {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
  }
`;

const ItemList = styled.li`
  margin-bottom: 20px;
  font-size: 20px;
  button.display {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
  button {
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
  a {
    margin-left: 10px;
    text-decoration: none;
    color: #e74c3c;
    font-size: 15px;
  }
`;

const PackSendBtn = styled.button`
  all: unset;
  position: absolute;
  bottom: 0;
  right: 0;
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
`;

const MyListWindow = ({
  userObj,
  map,
  places,
  setPlaces,
  setRoadViewObj,
  list,
  setList,
  packShare,
}) => {
  const listItemClick = (e) => {
    const {
      currentTarget: { innerText },
    } = e;
    let changeText;

    changeText = innerText.replace(/\n/g, ""); //행바꿈제거

    //리스트를 클릭하는 순간 지도 중심점 이동
    changeText.includes("공유삭제")
      ? (changeText = changeText.split("공유삭제")[0])
      : (changeText = changeText);
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

  const sendMessage = (place, imageUrl) => {
    Kakao.Link.sendDefault({
      objectType: "location",
      address: place.address_name,
      addressTitle: place.place_name,
      content: {
        title: "장소 공유",
        description: place.place_name,
        imageUrl,
        link: {
          webUrl: "https://wizardly-hopper-833bfb.netlify.app", // 추후 수정 필요
          mobileWebUrl: "https://wizardly-hopper-833bfb.netlify.app",
        },
      },
      buttons: [
        {
          title: "상세보기",
          link: {
            webUrl: place.place_url,
            mobileWebUrl: place.place_url, // 추후 수정 필요
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
    const url = place.category_group_code
      ? placeCode[place.category_group_code].url
      : placeCode["PS3"].url;
    sendMessage(place, url);
  };

  const deleteBtnClick = async (e) => {
    e.stopPropagation();
    const newList = [];
    let where;
    let index = 0;
    const object = await storeService
      .collection(`where-${userObj.uid}`)
      .get(queryAllByAttribute);
    object.forEach((item) => {
      if (item.data().id === e.target.id) {
        item.ref.delete();
        where = index;
      } else {
        newList.push(item.data());
      }
      index++;
    });
    const newArr = list;
    newArr.splice(where, 1);
    setList(newArr);
    setPlaces(newList);
  };

  const packShareBtnClick = () => {
    packShare.current.style.display = "block";
  };

  return (
    <>
      <ShowWindow>
        {list.length !== 0 ? (
          list.map((item) => (
            <ItemList className="list" onClick={listItemClick} key={item.id}>
              {item.place_name}
              <ButtonWrapper>
                <button id={item.id} onClick={shareBtnClick}>
                  공유
                </button>
                <button id={item.id} onClick={deleteBtnClick}>
                  삭제
                </button>
                <a href={item.place_url} target="_blank">
                  상세보기
                </a>
              </ButtonWrapper>
            </ItemList>
          ))
        ) : (
          <div className="empty">List is empty</div>
        )}
      </ShowWindow>
      {places.length !== 0 ? (
        <PackSendBtn onClick={packShareBtnClick}>묶음 공유</PackSendBtn>
      ) : (
        ""
      )}
    </>
  );
};

export default MyListWindow;

MyListWindow.propTypes = {
  map: PropTypes.object,
  places: PropTypes.array,
  setRoadObj: PropTypes.func,
  list: PropTypes.array,
  setList: PropTypes.func,
  packShare: PropTypes.object,
};
