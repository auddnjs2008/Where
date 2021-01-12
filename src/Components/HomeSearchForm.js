import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchForm = styled.form`
  margin-top: 5px;
  margin-bottom: 5px;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  right: 50px;
  z-index: 10;
  input[type="text"] {
    outline: none;
    border: none;
    background-color: #34495e;
    padding: 5px;
    color: white;
    font-weight: 600;
  }

  input[type="submit"] {
    all: unset;
    border: 1px solid black;
    color: #95a5a6;
    padding: 1px;
    background-color: black;
    &:active {
      transform: scale(0.98, 0.98);
    }
  }
`;

const { kakao } = window;

const HomeSearchForm = ({ setPlace, map, setError }) => {
  const [search, setSearch] = useState("");

  const handleSearchFun = (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      setPlace(result);
      const movePoint = new kakao.maps.LatLng(result[0].y, result[0].x);
      map.panTo(movePoint);
    } else {
      setError("찾을 수 없습니다.");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const searchIcon = document.querySelector("#searchIcon");
    searchIcon.style.opacity = "1";
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
    const search = document.querySelector("#searchIcon");
    if (name === "place") {
      setSearch(value);
    }
    if (search) {
      value !== ""
        ? (search.style.opacity = "0")
        : (search.style.opacity = "1");
    }
  };

  return (
    <SearchForm onSubmit={onSubmit}>
      <input onChange={onChange} type="text" name="place" value={search} />
      <FontAwesomeIcon
        id="searchIcon"
        icon={faSearch}
        style={{
          position: "absolute",
          left: "5px",
          top: "5px",
          color: "#95a5a6",
        }}
      ></FontAwesomeIcon>
      <input type="submit" value="Search" />
    </SearchForm>
  );
};

export default HomeSearchForm;

HomeSearchForm.propTypes = {
  setPlace: PropTypes.func,
  map: PropTypes.object,
  setError: PropTypes.func,
};
