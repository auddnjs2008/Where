import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const { kakao, Kakao } = window;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const MapButton = ({ map, bounds, place }) => {
  const handleMapSizeClick = (e) => {
    const {
      target: { name },
    } = e;
    const mapLevel = map.getLevel();
    if (name === "plus") {
      map.setLevel(mapLevel - 1);
    } else {
      map.setLevel(mapLevel + 1);
    }
  };

  const handleMapKindClick = (e) => {
    const {
      target: { name },
    } = e;
    if (name === "roadmap") {
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (name === "skymap") {
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    } else {
      // 로드뷰 도로를 지도위에 올린다.
      if (e.target.innerText.includes("OFF")) {
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        e.target.innerText = "로드뷰길 ON";
      } else {
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        e.target.innerText = "로드뷰길 OFF";
      }
    }
  };

  return (
    <ButtonWrapper>
      {place.length !== 0 ? (
        <button onClick={() => map.setBounds(bounds)}>한번에 보기</button>
      ) : (
        ""
      )}
      <button onClick={handleMapSizeClick} name="minus">
        지도 축소
      </button>
      <button onClick={handleMapSizeClick} name="plus">
        지도 확대
      </button>
      <button onClick={handleMapKindClick} name="roadmap">
        지도
      </button>
      <button onClick={handleMapKindClick} name="skymap">
        스카이뷰
      </button>
      <button onClick={handleMapKindClick} name="roadview">
        로드뷰길 OFF
      </button>
    </ButtonWrapper>
  );
};

export default MapButton;
