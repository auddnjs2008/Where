import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Map from "../Components/map";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import Navigator from "../Components/Navigator";
import Roadview from "../Components/roadview";
import ButtonWrapper from "../Components/MapButton";

const { kakao, Kakao } = window;

const SearchWrapper = styled.div`
  display: flex;
`;

const SearchSubWrapper = styled.div``;

const MapWrapper = styled.div`
  display: flex;
  position: relative;

  .placeCustom {
  }

  .map_wrap {
    overflow: hidden;
    height: 330px;
  }
  /* 지도위에 로드뷰의 위치와 각도를 표시하기 위한 map walker 아이콘의 스타일 */
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

const SearchForm = styled.form``;

const PlaceList = styled.ul`
  li {
    button {
      &.display {
        display: none;
      }
    }
  }
`;

const Home = ({ userObj }) => {
  const [position, setPosition] = useState([]);
  const [search, setSearch] = useState("");
  const [map, setMap] = useState(null);
  const [error, setError] = useState("");
  const [place, setPlace] = useState([]);
  const [markers, setMarker] = useState([]); // 마커들을 검색하고 저장해둔 다음 지워줘야 한다.
  const [bounds, setBounds] = useState();
  const [roadview, setRoadview] = useState({}); // 리스트를 클릭했을때  넘겨줄 장소정보

  const handleNavigate = (position) => {
    setPosition([position.coords.latitude, position.coords.longitude]);
    setRoadview({
      place_name: "나의 위치",
      y: position.coords.latitude,
      x: position.coords.longitude,
    });
  };

  const handleSearchFun = (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      setPlace(result);
      const movePoint = new kakao.maps.LatLng(result[0].y, result[0].x);
      map.panTo(movePoint);
    } else {
      setError("찾을 수 없습니다.");
    }
  };

  const handleListClick = (e) => {
    e.preventDefault();
    const {
      target: { id },
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
    e.target.lastChild.classList.toggle("display");
    setRoadview(where);
  };

  const saveFunction = async (newSavePlace, save) => {
    if (save) {
      await storeService.collection(`where-${userObj.uid}`).add(newSavePlace);
    } else {
      setError("이미 저장되어있는 장소입니다.");
    }
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    const attributes = [];
    let save = true;
    const {
      target: {
        parentNode: { id },
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

  const onSubmit = (e) => {
    e.preventDefault();

    if (map) {
      const places = new kakao.maps.services.Places([map]);
      places.keywordSearch(search, handleSearchFun);
    }
    setSearch("");
  };

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "place") {
      setSearch(value);
    }
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
        <SearchSubWrapper>
          {position !== [] ? (
            <MapWrapper className="mapwrapper">
              <Map position={position} setMap={setMap}></Map>
              <Roadview roadViewObj={roadview} map={map}></Roadview>
              <ButtonWrapper
                map={map}
                bounds={bounds}
                place={place}
              ></ButtonWrapper>
            </MapWrapper>
          ) : (
            <div>"Loading..."</div>
          )}
        </SearchSubWrapper>
        <PlaceList>
          {place.length !== 0
            ? place.map((item, index) => (
                <li
                  onClick={handleListClick}
                  key={index}
                  id={index}
                  className="list"
                >
                  {item.place_name}
                  <button onClick={handleSaveClick} className="display">
                    저장
                  </button>
                </li>
              ))
            : ""}
        </PlaceList>
        <SearchForm onSubmit={onSubmit}>
          <input
            onChange={onChange}
            type="text"
            placeholder="Search.."
            name="place"
            value={search}
          />
          <input type="submit" value="Search" />
        </SearchForm>
      </SearchWrapper>
    </>
  );
};

export default Home;
