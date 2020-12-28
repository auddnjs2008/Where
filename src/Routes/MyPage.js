import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Navigator from "../Components/Navigator";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import placeCode from "../placeCode";
import Map from "../Components/map";

const MyPage = ({userObj}) =>{
    const [places,setPlaces]=useState([]);
    const [position,setPosition]=useState([]);
    const [map,setMap]=useState(null);

    const getData = async ()=>{
        let testArray=[];
        const test = await storeService.collection(`where-${userObj.uid}`).get(queryAllByAttribute);
        test.forEach(item=>testArray.push(item.data()));
        setPlaces(testArray);
        setPosition([testArray[0].y,testArray[0].x]); // 임시 코드 
    }
    
    useEffect(()=>{
    getData();
    },[]);


    return (
      <>
      <Navigator/>
      <Map position={position} setMap={setMap}></Map>
      </>
    )
}

export default MyPage;