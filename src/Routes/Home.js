import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Map from "../Components/map";


const Home =() =>{
    const [position,setPosition]=useState([]); 
    
    const handleNavigate =(position)=>{
        setPosition([position.coords.latitude,position.coords.longitude]);
    }
    useEffect(()=>{
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(handleNavigate);

    },[])
    

    return(
    <>
        {position !== [] ?
            <Map position={position} ></Map> : <div>"Loading..."</div>
        }
     </>
    )

}

export default Home;