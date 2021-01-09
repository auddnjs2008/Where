import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import placeCode from "../placeCode";

const { kakao, Kakao } = window;

const StoreKind = styled.ul`
  background-color: rgba(25, 25, 25, 0.5);
  color: white;

  padding: 0px;
  //display: flex;
  list-style: none;
  li {
    cursor: pointer;
    width: inherit;
    text-align: center;
    padding: 5px;
    font-size: 13px;
    border-bottom: 1px solid rgba(20, 20, 20, 0.7);
  }
`;

const MyStoreKind = ({ map, setList, places, marker, bounds }) => {
  const storeTitleClick = (e) => {
    const {
      target: { id },
    } = e;
    let showMarker = [];
    const testBound = new kakao.maps.LatLngBounds();

    if (id !== "기타" && id !== "전체보기") {
      //카테고리 타입이 id인 요소들을 찾아준다.
      setList(
        places.filter((item) =>
          item.category_group_name === id ? true : false
        )
      );
    } else if (id === "기타") {
      setList(
        places.filter((item) =>
          item.category_group_name !== "음식점" &&
          item.category_group_name !== "카페" &&
          item.category_group_name !== "숙박" &&
          item.category_group_name !== "편의점" &&
          item.category_group_name !== "병원" &&
          item.category_group_name !== "약국" &&
          item.category_group_name !== "관광명소"
            ? true
            : false
        )
      );
    } else {
      setList(places);
    }

    //리스트를 클릭하면 그 해당하는 리스트 마커만 표시해준다.
    if (id !== "전체보기") {
      for (let i = 0; i < marker.length; i++) {
        if (placeCode[marker[i].code].title === id) {
          showMarker.push(marker[i]);
          marker[i].marker.setMap(map);
          testBound.extend(new kakao.maps.LatLng(places[i].y, places[i].x));
        } else {
          marker[i].marker.setMap(null);
        }
      }

      if (showMarker.length !== 0)
        // 리스트에 뭐가 있을때만  그 리스트의 목록들 중심좌표로 이동
        map.setBounds(testBound);
      else map.setBounds(bounds);
    } else {
      marker.forEach((item) => item.marker.setMap(map));
      showMarker = marker;
      map.setBounds(bounds);
    }

    // 그 리스트들만 보이게 중심좌표 이동
  };

  return (
    <StoreKind>
      <li key="0" onClick={storeTitleClick} id="전체보기">
        전체보기
      </li>
      <li key="1" onClick={storeTitleClick} id="음식점">
        음식점
      </li>
      <li key="2" onClick={storeTitleClick} id="카페">
        카페
      </li>
      <li key="3" onClick={storeTitleClick} id="숙박">
        숙박
      </li>
      <li key="4" onClick={storeTitleClick} id="편의점">
        편의점
      </li>
      <li key="5" onClick={storeTitleClick} id="병원">
        병원
      </li>
      <li key="6" onClick={storeTitleClick} id="약국">
        약국
      </li>
      <li key="7" onClick={storeTitleClick} id="관광명소">
        관광명소
      </li>
      <li key="8" onClick={storeTitleClick} id="기타">
        기타
      </li>
    </StoreKind>
  );
};
export default MyStoreKind;

MyStoreKind.propTypes = {
  map: PropTypes.object,
  setList: PropTypes.func,
  places: PropTypes.array,
  marker: PropTypes.array,
  bounds: PropTypes.object,
};
