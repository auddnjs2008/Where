import React, { useEffect, useState } from "react";

import styled from "styled-components";
import PropTypes from "prop-types";


const {kakao} =window;
const Map =({position,setMap})=>{
  
const [marker,setMarker] =useState(null);
const [controller,setControll]=useState(new kakao.maps.ZoomControl());

    
 useEffect(()=>{
    

    const container = document.getElementById("map");
    const options = {
        center : new kakao.maps.LatLng(position[0], position[1]),
        level:3,
    };

    const map = new kakao.maps.Map(container,options);
    //맵이 생성 되면 마크를 생성한다. 
    setMarker(new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(position[0], position[1])
    }))
    // 컨트롤러 생성
    map.addControl(controller,kakao.maps.ControlPosition.TOPRIGHT);
    setMap(map);
    
 },[position]);


    return (<div id="map" style={{width:"500px", height:"500px"}}>지도</div>)
}

export default Map;