import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Map from "./map";
import Roadview from "./roadview";
import MapButton from "./MapButton";

const MyMapContainer = styled.div`
  .loading {
    font-size: 30px;
    width: 99vw;
    height: 99vh;
    z-index: 100;
    font-weight: 600;
  }
`;

const MapWrapper = styled.div`
  position: relative;
  width: 99vw;
  height: 99vh;
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
    background: url("https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png") -298px -114px
      no-repeat;
  }
  .MapWalker .angleBack {
    width: 102px;
    height: 52px;
    background: url("https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png") -834px -2px
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

const MyMapWrapper = ({
  map,
  setMap,
  position,
  roadViewObj,
  roadview,
  places,
  bounds,
  setRoadViewObj,
  setRoadview,
}) => {
  return (
    <MyMapContainer>
      {position !== [] && roadViewObj !== null ? (
        <MapWrapper>
          <Map position={position} setMap={setMap} isMyPage={true}></Map>
          <Roadview
            roadViewObj={roadViewObj} // 로드맵 안내표
            map={map}
            setRoadObj={setRoadview} // 로드맵 객체  받아오는 함수
            setRoadview={setRoadViewObj} //  로드맵 안내표 받아오는 함수
          ></Roadview>
          <MapButton
            map={map}
            roadmap={roadview} // 로드맵
            bounds={bounds}
            place={places}
          ></MapButton>
        </MapWrapper>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </MyMapContainer>
  );
};

export default MyMapWrapper;

MyMapWrapper.propTypes = {
  map: PropTypes.object,
  setMap: PropTypes.func,
  position: PropTypes.array,
  roadObj: PropTypes.object,
  list: PropTypes.array,
  bounds: PropTypes.object,
};
