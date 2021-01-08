import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Navigator from "../Components/Navigator";
import HomeMapWrapper from "../Components/HomeMapWrapper";
import HomeSearchList from "../Components/HomeSearchList";
import HomeSearchForm from "../Components/HomeSearchForm";

const { kakao } = window;

const SearchWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
`;

const Home = ({ userObj }) => {
  const [position, setPosition] = useState([]);

  const [map, setMap] = useState(null);
  const [error, setError] = useState("");
  const [place, setPlace] = useState([]);
  const [markers, setMarker] = useState([]); // 마커들을 검색하고 저장해둔 다음 지워줘야 한다.
  const [bounds, setBounds] = useState();
  const [roadview, setRoadview] = useState({}); // 리스트를 클릭했을때  넘겨줄 장소정보
  const [roadMapObj, setRoadObj] = useState(null);

  const handleNavigate = (position) => {
    setPosition([position.coords.latitude, position.coords.longitude]);
    setRoadview({
      place_name: "나의 위치",
      y: position.coords.latitude,
      x: position.coords.longitude,
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleNavigate);
    }
  }, []);

  useEffect(() => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const listes = document.querySelectorAll(".list");
    const testBound = new kakao.maps.LatLngBounds();
    //전 마커들을 지워준다.
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    for (let i = 0; i < place.length; i++) {
      const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, i * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions
      );

      const newLat = new kakao.maps.LatLng(place[i].y, place[i].x);
      const marker = new kakao.maps.Marker({
        map: map,
        position: newLat,
        title: place[i].place_name,
        image: markerImage,
        clickable: true,
        disableClickZoom: true,
      });

      // 로드뷰에 나타나는 마커

      setMarker((prev) => [...prev, marker]);

      testBound.extend(newLat);
    }
    setBounds(testBound);
  }, [place]);

  return (
    <>
      <Navigator />
      <SearchWrapper>
        <HomeMapWrapper
          position={position}
          map={map}
          setMap={setMap}
          setRoadObj={setRoadObj}
          roadMapObj={roadMapObj}
          roadview={roadview}
          setRoadview={setRoadview}
          bounds={bounds}
          place={place}
        ></HomeMapWrapper>
        <HomeSearchList
          place={place}
          map={map}
          setRoadview={setRoadview}
          setError={setError}
          userObj={userObj}
        ></HomeSearchList>
        <HomeSearchForm
          setPlace={setPlace}
          map={map}
          setError={setError}
        ></HomeSearchForm>
      </SearchWrapper>
    </>
  );
};

export default Home;
