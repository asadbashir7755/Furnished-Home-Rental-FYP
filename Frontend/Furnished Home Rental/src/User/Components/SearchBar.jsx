import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaUserFriends, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { fetchPropertiesBySearch } from "./API/HomeCardData";
import { PropertyContext } from "../Context/HomeCardDataContext";
import { DatePicker, message, Tooltip } from "antd";
import axios from "axios";
import "../../Styles/SearchBar.css"; // Ensure this path is correct and matches case sensitivity

const { RangePicker } = DatePicker;

const SearchBar = () => {
  const { setProperties } = useContext(PropertyContext);
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const location = response.data.city || response.data.locality || `${latitude}, ${longitude}`;
            setSearchParams((prevParams) => ({
              ...prevParams,
              location,
            }));
          } catch (error) {
            console.error("Error fetching location name:", error);
            message.error("Unable to fetch current location. Please enter your location manually.");
          }
        },
        (error) => {
          console.error("Error fetching current location:", error);
          message.error("Unable to fetch current location. Please enter your location manually.");
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [checkInDate, checkOutDate] = dates;
      setSearchParams((prevParams) => ({
        ...prevParams,
        checkInDate: checkInDate.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
      }));
    }
  };

  const handleAdultsChange = (increment) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      adults: Math.max(1, prevParams.adults + increment),
    }));
  };

  const handleSearch = async () => {
    setSearching(true);
    localStorage.setItem("searchParams", JSON.stringify(searchParams));
    try {
      console.log("Sending search data:", searchParams);
      const data = await fetchPropertiesBySearch(searchParams);
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties by search:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <Tooltip title="Enter the location you want to visit" placement="top">
          <div className="search-item">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              name="location"
              placeholder="Where are you going?"
              value={searchParams.location}
              onChange={handleInputChange}
            />
          </div>
        </Tooltip>
        <div className="divider"></div>
        <Tooltip title="Select your check-in and check-out dates" placement="top">
          <div className="search-item">
            <FaCalendarAlt className="icon" />
            <RangePicker
              onChange={handleDateChange}
              className="date-picker"
              placeholder={["Check-in", "Check-out"]}
              style={{ width: "200%" }} // Increased width
            />
          </div>
        </Tooltip>
        <div className="divider"></div>
        <Tooltip title="Enter the number of adults" placement="top">
          <div className="search-item">
            <FaUserFriends className="icon" />
            <div className="adults-input">
              <button onClick={() => handleAdultsChange(-1)}>-</button>
              <input
                type="number"
                name="adults"
                value={searchParams.adults}
                readOnly
              />
              <button onClick={() => handleAdultsChange(1)}>+</button>
            </div>
          </div>
        </Tooltip>
        <button className="search-btn" onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : <><FaSearch className="search-icon" /> Search</>}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
