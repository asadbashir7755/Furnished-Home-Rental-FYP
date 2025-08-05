import React, { createContext, useState, useContext } from 'react';

const VerifyEmailContext = createContext();

export const VerifyEmailProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);

  return (
    <VerifyEmailContext.Provider value={{ formData, setFormData }}>
      {children}
    </VerifyEmailContext.Provider>
  );
};

export const useVerifyEmail = () => useContext(VerifyEmailContext);

export { VerifyEmailContext };
