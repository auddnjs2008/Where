import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

const { kakao } = window;

const Container = styled.div`
  z-index: 10;
  position: absolute;
  top: 30px;
  right: 50px;
  overflow: hidden;
`;

const PlaceList = styled.div`
  z-index: 10;
  margin-top: 22px;
  background-color: white;
  height: 86vh;
  overflow: auto;
  li {
    padding: 20px;
    list-style: none;
    border-bottom: 1px solid black;
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
  }

  &.up {
    @keyframes moveUp {
      from {
      }
      to {
        height: 0px;
      }
    }
    @keyframes moveDown {
      from {
        height: 0px;
      }
      to {
        height: 86vh;
      }
    }
    animation: ${(props) =>
      props.isUp
        ? "moveDown 0.3s linear forwards"
        : "moveUp 0.3s linear forwards"};

    //animation: moveUp 0.3s linear forwards;
  }
`;

const ListUpButton = styled.div`
  width: 30px;
  position: absolute;
  right: 0;
  margin-left: 300px;
  background-color: rgba(25, 25, 25, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  &:active {
    transform: scale(0.98, 0.98);
  }
`;

const ListItem = styled.div`
  #Name {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
    span {
      font-size: 15px;
      margin-right: 10px;
      border: 2px solid black;
      padding: 2px;
      border-radius: 50%;
      background-color: #6397e0;
      color: white;
    }
  }
  #Address {
    margin-bottom: 10px;
  }
  #SubInfo {
    margin-bottom: 10px;
    a {
      margin-left: 10px;
      text-decoration: none;
      color: #e74c3c;
    }
  }
`;

const HomeSearchList = ({ place, map, setRoadview, setError, userObj }) => {
  const [isUp, setUp] = useState(true);

  const handleListClick = (e) => {
    e.preventDefault();
    const {
      currentTarget: { id },
    } = e;
    const where = place[parseInt(id)];

    //클릭하는 순간 중심점을 이동시킨다.
    const movePoint = new kakao.maps.LatLng(where.y, where.x);
    map.panTo(movePoint);

    // 목표물 표시
    const center = document.querySelector("#map").firstChild;
    center.style.display = "block";
    setTimeout(() => {
      center.style.display = "none";
    }, 4000);

    //저장 버튼을 활성화 시킨다.  저장을 누르면 카테고리 별로 저장시킨다.
    //e.currentTarget.lastChild.classList.toggle("display");
    setRoadview(where);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    const attributes = [];
    let save = true;
    const {
      target: {
        parentNode: {
          parentNode: {
            parentNode: { id },
          },
        },
      },
    } = e;
    const object = place[id];

    //위 object를 파이어베이스에 저장해줘야 한다. //유저 아이디에 따라달리
    // id의 따른 콜렉션을 만들어주고 그안에 장소들을 저장해준다.
    let newPlace = {
      ...object,
      creator: userObj.uid,
    };

    const test = await storeService
      .collection(`where-${userObj.uid}`)
      .get(queryAllByAttribute);
    test.forEach((item) => attributes.push(item.data()));

    attributes.forEach((item) =>
      item.place_name === newPlace.place_name ? (save = false) : ""
    );
    saveFunction(newPlace, save);
  };

  const saveFunction = async (newSavePlace, save) => {
    if (save) {
      await storeService.collection(`where-${userObj.uid}`).add(newSavePlace);
    } else {
      setError("이미 저장되어있는 장소입니다.");
    }
  };

  const listUpClick = (e) => {
    setUp((prev) => !prev);
  };

  useEffect(() => {
    setUp(true);
  }, [place]);

  return (
    <Container>
      {place.length !== 0 ? (
        <ListUpButton onClick={listUpClick}>
          {!isUp ? (
            <FontAwesomeIcon icon={faSortDown}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faSortUp}></FontAwesomeIcon>
          )}
        </ListUpButton>
      ) : (
        ""
      )}
      <PlaceList isUp={isUp} className="listBox up">
        {place.length !== 0
          ? place.map((item, index) => (
              <li
                onClick={handleListClick}
                key={index}
                id={index}
                className="list"
              >
                <ListItem>
                  <div id="Name">
                    <span>{index + 1}</span>
                    {item.place_name}
                  </div>
                  <div id="Address">{item.address_name}</div>
                  <div id="SubInfo">
                    {item.phone}
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={item.place_url}
                      target="_blank"
                    >
                      상세보기
                    </a>
                    <button onClick={handleSaveClick} className="display">
                      저장
                    </button>
                  </div>
                </ListItem>
              </li>
            ))
          : ""}
      </PlaceList>
    </Container>
  );
};

export default HomeSearchList;

HomeSearchList.propTypes = {
  place: PropTypes.array,
  map: PropTypes.object,
  setRoadview: PropTypes.func,
  setError: PropTypes.func,
  userObj: PropTypes.object.isRequired,
};
