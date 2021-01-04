import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useEffect } from "react";

const { kakao } = window;

const Roadview = ({ position, map }) => {
  const MapWalker = (position) => {
    // 맵 아이콘 생성 함수
    const content = document.createElement("div");
    const figure = document.createElement("div");
    const angleBack = document.createElement("div");
    const mapWrapper = document.querySelector(".mapwrapper");

    content.className = "MapWalker";
    figure.className = "figure";
    angleBack.className = "angleBack";

    content.appendChild(angleBack);
    content.appendChild(figure);
    mapWrapper.appendChild(content);
    const walker = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1,
    });

    this.walker = walker;
    this.content = content;
  };
  MapWalker.setAngle = function (angle) {
    const threshold = 22.5; //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
    for (const i = 0; i < 16; i++) {
      //각도에 따라 변화되는 앵글 이미지의 수가 16개
      if (angle > threshold * i && angle < threshold * (i + 1)) {
        //각도(pan)에 따라 아이콘의 class명을 변경
        const className = "m" + i;
        this.content.className = this.content.className.split(" ")[0];
        this.content.className += " " + className;
        break;
      }
    }
  };

  MapWalker.setPosition = function (position) {
    this.walker.setPosition(position);
  };

  MapWalker.setMap = function (map) {
    this.walker.setMap(map);
  };
  useEffect(() => {
    const roadviewContainer = document.getElementById("roadview"); //로드뷰를 표시할 div

    const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
    const roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
    const positionObj = new kakao.maps.LatLng(position[0], position[1]);

    roadviewClient.getNearestPanoId(positionObj, 50, function (panoId) {
      console.log(panoId);
      roadview.setPanoId(panoId, positionObj); //panoId와 중심좌표를 통해 로드뷰 실행
    });

    // 동동이를 지도에 올려준다.
    kakao.maps.event.addListener(roadview, "init", () => {
      const mapWalker = new MapWalker(positionObj);
      mapWalker.setMap(map);
    });
  }, [position]);

  return <div id="roadview" style={{ width: "500px", height: "500px" }}></div>;
};

export default Roadview;
