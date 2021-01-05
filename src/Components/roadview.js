import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const { kakao } = window;

const Container = styled.div``;

const Roadview = ({ roadViewObj, map }) => {
  const [mapWalker, setMapWalker] = useState(null);
  const [marker, setMarker] = useState(null);

  function MapWalker(position) {
    // 맵 아이콘 생성 함수
    const content = document.createElement("div");
    const figure = document.createElement("div");
    const angleBack = document.createElement("div");
    //const mapWrapper = document.querySelector(".mapwrapper");

    content.className = "MapWalker";
    figure.className = "figure";
    angleBack.className = "angleBack";

    content.appendChild(angleBack);
    content.appendChild(figure);
    //mapWrapper.appendChild(content);
    const walker = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1,
    });

    this.walker = walker;
    this.content = content;
  }

  MapWalker.prototype.setAngle = function (angle) {
    const threshold = 22.5; //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
    for (let i = 0; i < 16; i++) {
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

  MapWalker.prototype.setPosition = function (position) {
    this.walker.setPosition(position);
  };

  MapWalker.prototype.setMap = function (map) {
    this.walker.setMap(map);
  };

  useEffect(() => {
    const roadviewContainer = document.getElementById("roadview"); //로드뷰를 표시할 div

    const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
    const roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
    const positionObj = new kakao.maps.LatLng(roadViewObj.y, roadViewObj.x);
    let roadMarker = null;

    roadviewClient.getNearestPanoId(positionObj, 50, function (panoId) {
      if (panoId != null) {
        roadview.setPanoId(panoId, positionObj); //panoId와 중심좌표를 통해 로드뷰 실행

        if (marker) marker.setMap(null); // 만약 마커가 있으면 지워줘야 한다.

        roadMarker = new kakao.maps.Marker({
          position: positionObj,
          map: roadview,
          //title: where.place_name,
        });
        setMarker(roadMarker);
        // 커스텀 오버레이를 생성한다.  (검색창으로 이어질 수 있게 )

        const content = `<div class="placeCustom" style="display:flex; padding:10px; background-color:white; ">
            <div style="margin-right:5px; font-size:20px; font-weight:600;">${roadViewObj.place_name}</div>
            <button class="searchBtn">검색</button>
          </div>`;

        const customOverlay = new kakao.maps.CustomOverlay({
          position: positionObj,
          content: content,
          xAnchor: 0.3,
          yAnchor: 1.9,
        });

        customOverlay.setMap(roadview);
      }
    });

    // 동동이를 지도에 올려준다.

    // 로드뷰가 초기화된 후 추가 이벤트를 등록한다.
    // 로드뷰를 상,하,좌.우 .줌인 줌아웃을 할경우 발생

    if (mapWalker !== null) mapWalker.setMap(map);

    kakao.maps.event.addListener(roadview, "viewpoint_changed", function () {
      const viewpoint = roadview.getViewpoint();
      mapWalker.setAngle(viewpoint.pan);
    });

    // 로드뷰내의 화살표나 점프를 하였을 경우 발생하낟.
    // position값이 바뀔 때마다 map walker의 상태를 변경해 준다.
    kakao.maps.event.addListener(roadview, "position_changed", function () {
      const position = roadview.getPosition();
      mapWalker.setPosition(position);
      map.setCenter(position);

      //위치가 바뀔 때마다  마커가 보이도록 뷰포인트를 설정해줘야 한다.
      const viewpoint = roadview
        .getProjection()
        .viewpointFromCoords(
          roadMarker.getPosition(),
          roadMarker.getAltitude()
        );
      roadview.setViewpoint(viewpoint);
    });
  }, [roadViewObj, mapWalker]);

  useEffect(() => {
    setMapWalker(
      new MapWalker(new kakao.maps.LatLng(roadViewObj.y, roadViewObj.x))
    );
  }, []);

  // useEffect(() => {
  //   const click = () => console.log("클릭");
  //   if (searchButton) {
  //     searchButton.addEventListener("click", click);
  //   }
  //   console.log(searchButton);
  // }, [searchButton]);

  return (
    <Container
      id="roadview"
      style={{ width: "500px", height: "500px" }}
    ></Container>
  );
};

export default Roadview;
