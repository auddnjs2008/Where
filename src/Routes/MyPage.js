import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import PropTypes from "prop-types";
import Navigator from "../Components/Navigator";
import { storeService } from "../firebase";
import { queryAllByAttribute } from "@testing-library/react";
import placeCode from "../placeCode";
import Map from "../Components/map";

const {kakao,Kakao} =window;


const Wrapper = styled.div`
    display:flex;
`;
const Container = styled.div``;
const StoreKind=styled.ul`
    display:flex;
    list-style:none;
    li{
        margin-right:10px;
    }
`;

const ShowWindow=styled.ul``;

const ItemList = styled.li`

    button.display{
        display:none;
    }


`;




const MyPage = ({userObj}) =>{
    const [places,setPlaces]=useState([]);
    const [position,setPosition]=useState([]);
    const [map,setMap]=useState(null);
    const [list,setList]=useState([]);
    const [marker,setMarker]=useState([]);
    const [bounds,setBounds]=useState();



    





    const getData = async ()=>{
        let testArray=[];
        const test = await storeService.collection(`where-${userObj.uid}`).get(queryAllByAttribute);
        test.forEach(item=>testArray.push(item.data()));
        setPlaces(testArray);
        setList(testArray);
        setPosition([testArray[0].y,testArray[0].x]); // 임시 코드 
    }
    

    const initMarkerDraw=()=>{
        
        const testArray=[];
        const testBound = new kakao.maps.LatLngBounds();
        
        for(let i=0; i<places.length ; i++){ 
            
            const imageSrc = placeCode[places[i].category_group_code].url;
            const imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
            const imageOption ={offset:new kakao.maps.Point(27,37)}; 

            const markerImage = new kakao.maps.MarkerImage(imageSrc,imageSize,imageOption);

            const newLat = new kakao.maps.LatLng(places[i].y,places[i].x);
            const marker = new kakao.maps.Marker({
                map:map,
                position:newLat,
                title:places[i].place_name,
                image:markerImage,
                clickable:true,
                disableClickZoom: true
            })
            //setMarker(prev => [...prev,marker]);
            //testBound.extend(newLat);
            marker.setMap(map);
            testArray.push({marker,code:places[i].category_group_code});
            setMarker(testArray);
            testBound.extend(newLat);
            setBounds(testBound);
        }
        map.setBounds(testBound);
    }

    const storeTitleClick=(e)=>{
        const {target:{id}}=e;
        let showMarker=[];
        const testBound = new kakao.maps.LatLngBounds();

        if(id !== "기타" && id !=="전체보기"){
            //카테고리 타입이 id인 요소들을 찾아준다. 
            setList(places.filter(item=>item.category_group_name === id ? true : false));
            
        }else if(id ==="기타"){
            setList(places.filter(item=>(item.category_group_name !== "음식점" && item.category_group_name !== "카페"&& item.category_group_name !== "숙박"
            && item.category_group_name !== "편의점"&& item.category_group_name !== "병원"&& item.category_group_name !== "약국"&& item.category_group_name !== "관광명소") ? true: false))
        }else{
            setList(places);
        }
    
        //리스트를 클릭하면 그 해당하는 리스트 마커만 표시해준다.
        if(id !== "전체보기"){ 
            for(let i=0; i<marker.length ; i++){
                if(placeCode[marker[i].code].title === id){
                    showMarker.push(marker[i]);
                    marker[i].marker.setMap(map);
                    testBound.extend(new kakao.maps.LatLng(places[i].y,places[i].x));    
                
                }else{
                    marker[i].marker.setMap(null);
                }
            }

            if(showMarker.length !== 0) // 리스트에 뭐가 있을때만  그 리스트의 목록들 중심좌표로 이동
                map.setBounds(testBound);
            else
                map.setBounds(bounds);
        }else{
            marker.forEach(item =>item.marker.setMap(map));
            showMarker=marker;
            map.setBounds(bounds);
        }

        // 그 리스트들만 보이게 중심좌표 이동 
         
    
    }

    const listItemClick =(e) =>{
        const {target :{lastChild}}=e;
        lastChild.classList.toggle("display");
    }
    
    const shareBtnClick =(e) =>{
       e.stopPropagation();
       const {target:{id}}=e;
       const [place] = places.filter(item=>item.id === id);
       //친구한테 공유를 해줘야한다. 
    }
   


    
    useEffect(()=>{
        getData();  
    },[]);

    useEffect(()=>{
       if(map){
        initMarkerDraw();    
       } 
    },[map])

    //1.음식점 2.카페 3.숙박 4.편의점 5.병원 6.약국 7.관광명소 8.

    return (
      <>
      <Navigator/>
      <Wrapper>
        <Map position={position} setMap={setMap}></Map>
        <Container>
            <StoreKind>
                <li key="0" onClick={storeTitleClick} id="전체보기">전체보기</li> 
                <li key="1" onClick={storeTitleClick} id="음식점">음식점</li>
                <li key="2" onClick={storeTitleClick} id="카페">카페</li>
                <li key="3" onClick={storeTitleClick} id="숙박">숙박</li>
                <li key="4" onClick={storeTitleClick} id="편의점">편의점</li>
                <li key="5" onClick={storeTitleClick} id="병원">병원</li>
                <li key="6" onClick={storeTitleClick} id="약국">약국</li>
                <li key="7" onClick={storeTitleClick} id="관광명소">관광명소</li>
                <li key="8" onClick={storeTitleClick} id="기타">기타</li>
            </StoreKind>
            <ShowWindow>
                {list.length !==0 ? list.map(item=><ItemList   onClick={listItemClick} key={item.id}>{item.place_name}<button id={item.id} onClick={shareBtnClick} className="display">공유</button></ItemList>) : ""}
            </ShowWindow>
        </Container>
      </Wrapper>
      </>
    )
}

export default MyPage;