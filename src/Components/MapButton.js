import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {
  faCar,
  faCompressArrowsAlt,
  faExpandArrowsAlt,
  faPlane,
  faPlaneSlash,
} from "@fortawesome/free-solid-svg-icons";

const { kakao } = window;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 5px;
  right: 10px;
  z-index: 3;
  button {
    width: 40px;
    margin-bottom: 10px;
    outline: none;
    border: none;
    border: 1px solid black;
    background-color: #3498db;
    color: white;
    box-shadow: 0px 2px 1px rgba(20, 20, 20, 0.5);
    &:active {
      transform: scale(0.9, 0.9);
    }
  }
`;

const MapButton = ({ map, bounds, place, roadmap }) => {
  const [size, setWindow] = useState(window.innerWidth);

  const handleMapSizeClick = (e) => {
    const {
      currentTarget: { name },
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
      currentTarget: { name },
    } = e;
    if (name === "roadmap") {
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    } else if (name === "skymap") {
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    } else if (name === "roadview") {
      // 로드뷰 도로를 지도위에 올린다.

      if (e.currentTarget.lastChild.innerText.includes("OFF")) {
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        e.currentTarget.lastChild.innerText = "ON";
      } else {
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        e.currentTarget.lastChild.innerText = "OFF";
      }
    }
  };

  const handleToggleClick = (e) => {
    const mapContainer = document.querySelector("#map");
    const roadMapContainer = document.querySelector("#roadview");
    const roadCenter = roadmap.getPosition();

    // 화면 크기를 전환시키는 역할 기능을 구현해야 한다.
    // top: "0",width: "99vw",height: "99vh",   // left: 0; bottom: 0;
    if (e.currentTarget.innerText === "Road") {
      //이러면 로드뷰를 크게 만들어준다.

      mapContainer.style.top = "65vh";
      mapContainer.style.zIndex = "3";
      mapContainer.style.bottom = "0";
      mapContainer.style.width = "200px";
      mapContainer.style.height = "200px";

      roadMapContainer.style.top = "0";
      roadMapContainer.style.width = "99vw";
      roadMapContainer.style.height = "99vh";
      e.currentTarget.innerText = "Map";
      //지도 크기와 방향을 조정해야 한다.
    } else {
      roadMapContainer.style.top = "65vh";
      roadMapContainer.style.bottom = "0";
      roadMapContainer.style.width = "200px";
      roadMapContainer.style.height = "200px";
      mapContainer.style.top = "0";
      mapContainer.style.width = "99vw";
      mapContainer.style.height = "99vh";
      mapContainer.style.zIndex = "0";

      e.currentTarget.innerText = "Road";
    }

    map.relayout();
    roadmap.relayout();
    map.setCenter(roadCenter);
    //map.setLevel(1);
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWindow(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWindow(window.innerWidth));
  }, []);

  return (
    <ButtonWrapper size={size}>
      {place.length !== 0 ? (
        <button onClick={() => map.setBounds(bounds)}>한번에 보기</button>
      ) : (
        ""
      )}
      <button onClick={handleMapSizeClick} name="minus">
        <FontAwesomeIcon icon={faExpandArrowsAlt}></FontAwesomeIcon>
      </button>
      <button onClick={handleMapSizeClick} name="plus">
        <FontAwesomeIcon icon={faCompressArrowsAlt}></FontAwesomeIcon>
      </button>
      <button onClick={handleToggleClick}>Road</button>
      <button onClick={handleMapKindClick} name="roadmap">
        <FontAwesomeIcon icon={faPlaneSlash}></FontAwesomeIcon>
      </button>
      <button onClick={handleMapKindClick} name="skymap">
        <FontAwesomeIcon icon={faPlane}></FontAwesomeIcon>
      </button>
      <button onClick={handleMapKindClick} name="roadview">
        <FontAwesomeIcon icon={faCar}></FontAwesomeIcon>
        <br />
        <span>OFF</span>
      </button>
    </ButtonWrapper>
  );
};

export default MapButton;

MapButton.propTypes = {
  map: PropTypes.object,
  bounds: PropTypes.object,
  place: PropTypes.array,
  roadmap: PropTypes.object,
};
