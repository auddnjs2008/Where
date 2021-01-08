import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Navigator from "../Components/Navigator";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import placeCode from "../placeCode";
import MyMapWrapper from "../Components/MyMapWrapper";
import MyStoreKind from "../Components/MyStoreKind";
import MyListWindow from "../Components/MyListWindow";

const { kakao, Kakao } = window;

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
`;
const Container = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  right: 20px;
`;

const MyPage = ({ userObj }) => {
  const [places, setPlaces] = useState([]); // 내가 가지고 있는 장소들
  const [position, setPosition] = useState([]);
  const [map, setMap] = useState(null);
  const [list, setList] = useState([]); // 장소 타이틀을 클릭했을때  목록들
  const [marker, setMarker] = useState([]);
  const [bounds, setBounds] = useState();
  const [roadViewObj, setRoadViewObj] = useState(null); // 로드맵 안내표 받아오기
  const [roadview, setRoadview] = useState(null); // 로드맵 받아오기

  const getData = async () => {
    let testArray = [];
    const test = await storeService
      .collection(`where-${userObj.uid}`)
      .get(queryAllByAttribute);
    test.forEach((item) => testArray.push(item.data()));
    setPlaces(testArray);
    setList(testArray);
    setPosition([parseInt(testArray[0].y), parseInt(testArray[0].x)]); // 임시 코드
    setRoadViewObj(testArray[0]);
  };

  const initMarkerDraw = () => {
    const testArray = [];
    const testBound = new kakao.maps.LatLngBounds();
    for (let i = 0; i < places.length; i++) {
      const imageSrc = placeCode[places[i].category_group_code].url;
      const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(27, 37) };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const newLat = new kakao.maps.LatLng(places[i].y, places[i].x);
      const marker = new kakao.maps.Marker({
        map: map,
        position: newLat,
        title: places[i].place_name,
        image: markerImage,
        clickable: true,
        disableClickZoom: true,
      });
      //setMarker(prev => [...prev,marker]);
      //testBound.extend(newLat);
      marker.setMap(map);
      testArray.push({ marker, code: places[i].category_group_code });
      setMarker(testArray);
      testBound.extend(newLat);
      setBounds(testBound);
    }
    map.setBounds(testBound);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (map) {
      initMarkerDraw();
    }
  }, [map]);

  //1.음식점 2.카페 3.숙박 4.편의점 5.병원 6.약국 7.관광명소 8.

  return (
    <>
      <Navigator />
      <Wrapper>
        <MyMapWrapper
          map={map}
          setMap={setMap}
          position={position}
          roadViewObj={roadViewObj}
          roadview={roadview}
          places={places}
          bounds={bounds}
          setRoadViewObj={setRoadViewObj}
          setRoadview={setRoadview}
        ></MyMapWrapper>
        <Container>
          <MyStoreKind
            map={map}
            setList={setList}
            places={places}
            marker={marker}
            bounds={bounds}
          ></MyStoreKind>
          <MyListWindow
            map={map}
            places={places}
            setRoadViewObj={setRoadViewObj}
            list={list}
          ></MyListWindow>
        </Container>
      </Wrapper>
    </>
  );
};

export default MyPage;
