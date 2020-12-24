import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Map from "../Components/map";

const {kakao} =window;


const SearchWrapper = styled.div`
    display:flex;

`;

const SearchSubWrapper = styled.div``;
const ButtonWrapper = styled.div``;

const SearchForm =styled.form``;

const PlaceList=styled.ul``;



const Home =() =>{
    const [position,setPosition]=useState([]); 
    const [search,setSearch]=useState("");
    const [map,setMap] =useState(null);
    const [error,setError] =useState("");
    const [place,setPlace]=useState([]);
    const [markers,setMarker] =useState([]); // 마커들을 검색하고 저장해둔 다음 지워줘야 한다. 
    const [bounds,setBounds]=useState();

    const handleNavigate =(position)=>{
        setPosition([position.coords.latitude,position.coords.longitude]);
    }

    const handleSearchFun = (result,status) => {
        if(status  === kakao.maps.services.Status.OK){
            setPlace(result);

        }else{
            setError("찾을 수 없습니다.");
        }

    }

    const handleListClick = (e)=>{

        const {target:{id}}=e;
        const where = place[parseInt(id)];
        
        //클릭하는 순간 중심점을 이동시킨다. 
        const movePoint = new kakao.maps.LatLng(where.y,where.x);
        map.panTo(movePoint);
    
    }

    const handleMapSizeClick =(e)=>{
        const {target:{name}}=e;
        const mapLevel = map.getLevel();
        if(name === "plus"){
            map.setLevel(mapLevel-1);
        }else{
            map.setLevel(mapLevel+1);
        }

    }

    const handleMapKindClick=(e)=>{
        const {target :{name}}=e;
        if(name === "roadmap"){
            map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP); 
        }else{
            map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);   
        }

    }




    const onSubmit=(e)=>{
        e.preventDefault();
    
        if(map){
        const places = new kakao.maps.services.Places([map]);
        places.keywordSearch(search,handleSearchFun);
        }
        setSearch("");

    }

    const onChange =(e) =>{
        const {target :{name,value}}=e;
        if(name === "place"){
            setSearch(value);
         
        }
    }


    useEffect(()=>{
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(handleNavigate);

    },[])

    useEffect(()=>{
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const listes = document.querySelectorAll(".list");
        const testBound = new kakao.maps.LatLngBounds()
        //전 마커들을 지워준다. 
        for(let i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }

       for(let i=0; i<place.length ; i++){ 
            const imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
            const imgOptions =  {
                spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new kakao.maps.Point(0, (i*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            };

            const markerImage = new kakao.maps.MarkerImage(imageSrc,imageSize,imgOptions);

            const newLat = new kakao.maps.LatLng(place[i].y,place[i].x);
            const marker = new kakao.maps.Marker({
                map:map,
                position:newLat,
                title:place[i].place_name,
                image:markerImage,
                clickable:true
            })
            setMarker(prev => [...prev,marker]);
            testBound.extend(newLat);
         
        }
        setBounds(testBound);
        listes.forEach(item => item.addEventListener("click",handleListClick));
        return ()=> listes.forEach(item=>item.removeEventListener("click",handleListClick)); 
    },[place])

  



    

    return(
        <>
        <SearchWrapper>
            <SearchSubWrapper>
                {position !== [] ?
                    <Map position={position} setMap={setMap}></Map> : <div>"Loading..."</div>
                }
                <ButtonWrapper>
                    <button onClick={()=>map.setBounds(bounds)}>한번에 보기</button>
                    <button onClick={handleMapSizeClick} name="minus">지도 축소</button>
                    <button onClick={handleMapSizeClick} name="plus">지도 확대</button> 
                    <button onClick={ handleMapKindClick} name="roadmap">지도</button>
                    <button onClick={ handleMapKindClick} name="skymap">스카이뷰</button>
                </ButtonWrapper>
            </SearchSubWrapper>
            <PlaceList>
                {place.length !==0 ? place.map((item,index)=><li key={index} id={index} className="list">{item.place_name}</li>) : "" }
            </PlaceList>
            <SearchForm onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Search.." name="place" value={search}/>
                <input type="submit" value="Search"/>
            </SearchForm>
        </SearchWrapper>

        
     </>
    )

}

export default Home;