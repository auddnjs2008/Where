import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import PropTypes from "prop-types";
import Navigator from "../Components/Navigator";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import placeCode from "../placeCode";
import Map from "../Components/map";
import Roadview from "../Components/roadview";
import MapButton from "../Components/MapButton";

const { kakao, Kakao } = window;

const Wrapper = styled.div`
  display: flex;
`;
const Container = styled.div``;

const MapWrapper = styled.div`
  position: relative;

  .MapWalker {
    position: absolute;
    margin: -26px 0 0 -51px;
  }
  .MapWalker .figure {
    position: absolute;
    width: 25px;
    left: 38px;
    top: -2px;
    height: 39px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png) -298px -114px
      no-repeat;
  }
  .MapWalker .angleBack {
    width: 102px;
    height: 52px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png) -834px -2px
      no-repeat;
  }
  .MapWalker.m0 .figure {
    background-position: -298px -114px;
  }
  .MapWalker.m1 .figure {
    background-position: -335px -114px;
  }
  .MapWalker.m2 .figure {
    background-position: -372px -114px;
  }
  .MapWalker.m3 .figure {
    background-position: -409px -114px;
  }
  .MapWalker.m4 .figure {
    background-position: -446px -114px;
  }
  .MapWalker.m5 .figure {
    background-position: -483px -114px;
  }
  .MapWalker.m6 .figure {
    background-position: -520px -114px;
  }
  .MapWalker.m7 .figure {
    background-position: -557px -114px;
  }
  .MapWalker.m8 .figure {
    background-position: -2px -114px;
  }
  .MapWalker.m9 .figure {
    background-position: -39px -114px;
  }
  .MapWalker.m10 .figure {
    background-position: -76px -114px;
  }
  .MapWalker.m11 .figure {
    background-position: -113px -114px;
  }
  .MapWalker.m12 .figure {
    background-position: -150px -114px;
  }
  .MapWalker.m13 .figure {
    background-position: -187px -114px;
  }
  .MapWalker.m14 .figure {
    background-position: -224px -114px;
  }
  .MapWalker.m15 .figure {
    background-position: -261px -114px;
  }
  .MapWalker.m0 .angleBack {
    background-position: -834px -2px;
  }
  .MapWalker.m1 .angleBack {
    background-position: -938px -2px;
  }
  .MapWalker.m2 .angleBack {
    background-position: -1042px -2px;
  }
  .MapWalker.m3 .angleBack {
    background-position: -1146px -2px;
  }
  .MapWalker.m4 .angleBack {
    background-position: -1250px -2px;
  }
  .MapWalker.m5 .angleBack {
    background-position: -1354px -2px;
  }
  .MapWalker.m6 .angleBack {
    background-position: -1458px -2px;
  }
  .MapWalker.m7 .angleBack {
    background-position: -1562px -2px;
  }
  .MapWalker.m8 .angleBack {
    background-position: -2px -2px;
  }
  .MapWalker.m9 .angleBack {
    background-position: -106px -2px;
  }
  .MapWalker.m10 .angleBack {
    background-position: -210px -2px;
  }
  .MapWalker.m11 .angleBack {
    background-position: -314px -2px;
  }
  .MapWalker.m12 .angleBack {
    background-position: -418px -2px;
  }
  .MapWalker.m13 .angleBack {
    background-position: -522px -2px;
  }
  .MapWalker.m14 .angleBack {
    background-position: -626px -2px;
  }
  .MapWalker.m15 .angleBack {
    background-position: -730px -2px;
  }
`;

const StoreKind = styled.ul`
  display: flex;
  list-style: none;
  li {
    margin-right: 10px;
  }
`;

const ShowWindow = styled.ul``;

const ItemList = styled.li`
  button.display {
    display: none;
  }
`;

const MyPage = ({ userObj }) => {
  const [places, setPlaces] = useState([]); // 내가 가지고 있는 장소들
  const [position, setPosition] = useState([]);
  const [map, setMap] = useState(null);
  const [list, setList] = useState([]); // 장소 타이틀을 클릭했을때  목록들
  const [marker, setMarker] = useState([]);
  const [bounds, setBounds] = useState();
  const [roadObj, setRoadObj] = useState(null);

  const getData = async () => {
    let testArray = [];
    const test = await storeService
      .collection(`where-${userObj.uid}`)
      .get(queryAllByAttribute);
    test.forEach((item) => testArray.push(item.data()));
    setPlaces(testArray);
    setList(testArray);
    setPosition([testArray[0].y, testArray[0].x]); // 임시 코드
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

  const listItemClick = (e) => {
    const {
      target: { lastChild, innerText },
    } = e;
    let changeText;
    lastChild.classList.toggle("display");
    //리스트를 클릭하는 순간 지도 중심점 이동
    innerText.includes("공유")
      ? (changeText = innerText.split("공유")[0])
      : (changeText = innerText);
    const [target] = places.filter((item) => item.place_name === changeText);
    const movePoint = new kakao.maps.LatLng(target.y, target.x);
    map.setLevel(3);
    map.setCenter(movePoint);
    const center = document.querySelector("#map").firstChild;
    center.style.display = "block";
    setTimeout(() => {
      center.style.display = "none";
    }, 4000);
    setRoadObj(target);
  };

  const sendMessage = (address, title, imageUrl) => {
    Kakao.Link.sendDefault({
      objectType: "location",
      address,
      addressTitle: title,
      content: {
        title: "장소 공유",
        description: title,
        imageUrl,
        link: {
          webUrl: "https://developers.kakao.com", // 추후 수정 필요
        },
      },
      buttons: [
        {
          title: "웹으로 이동",
          link: {
            mobileWebUrl: "https://developers.kakao.com", // 추후 수정 필요
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

    sendMessage(
      place.address_name,
      place.place_name,
      placeCode[place.category_group_code].url
    );
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
        <MapWrapper>
          <Map position={position} setMap={setMap} isMyPage={true}></Map>
          {roadObj ? <Roadview roadViewObj={roadObj} map={map}></Roadview> : ""}
          <MapButton map={map} bounds={bounds} place={list}></MapButton>
        </MapWrapper>
        <Container>
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
          <ShowWindow>
            {list.length !== 0
              ? list.map((item) => (
                  <ItemList onClick={listItemClick} key={item.id}>
                    {item.place_name}
                    <button
                      id={item.id}
                      onClick={shareBtnClick}
                      className="display"
                    >
                      공유
                    </button>
                  </ItemList>
                ))
              : ""}
          </ShowWindow>
        </Container>
      </Wrapper>
    </>
  );
};

export default MyPage;
