import React, { useEffect, useState } from "react";

import styled from "styled-components";
import PropTypes from "prop-types";

const { kakao } = window;

const Marker = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
  opacity: 0.7;
  width: 50px;
  height: 50px;
  background-color: #e74c3c;
  border-radius: 50%;
  display: none;
  z-index: 2;
  @keyframes Marker {
    0% {
      opacity: 0.7;
      width: 50px;
      height: 50px;
    }
    100% {
      opacity: 0;
      width: 0px;
      height: 0px;
      display: none;
    }
  }
  animation: Marker 1s linear infinite;
`;

const Map = ({ position, setMap, isMyPage }) => {
  const [marker, setMarker] = useState(null);
  const [controller, setControll] = useState(new kakao.maps.ZoomControl());
  const positionObj = new kakao.maps.LatLng(position[0], position[1]);
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: positionObj,
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);
    //맵이 생성 되면 마크를 생성한다.
    if (!isMyPage) {
      setMarker(
        new kakao.maps.Marker({
          map: map,
          position: positionObj,
        })
      );
    }

    map.addControl(controller, kakao.maps.ControlPosition.TOPRIGHT);
    setMap(map);
  }, [position]);

  return (
    <div
      id="map"
      style={{ position: "relative", width: "90vw", height: "90vh" }}
    >
      <Marker className="center"></Marker>
    </div>
  );
};

export default Map;
