import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { fetchProperties } from "../Components/API/HomeCardData";

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("PropertyProvider useEffect triggered");
    if (properties.length === 0) {
      console.log("Fetching properties as properties array is empty");
      const getProperties = async () => {
        try {
          const data = await fetchProperties();
          setProperties(data);
        } catch (error) {
          console.error("Error fetching properties:", error);
        } finally {
          setLoading(false);
        }
      };

      getProperties();
    } else {
      console.log("Properties already fetched, skipping fetch");
      setLoading(false);
    }
  }, []); // Empty dependency array to run only once

  return (
    <PropertyContext.Provider value={{ properties, setProperties, loading, setLoading }}>
      {children}
    </PropertyContext.Provider>
  );
};

PropertyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};




