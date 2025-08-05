import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { FormProvider } from "./Admin/FormContext.jsx"; // Import FormProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FormProvider> {/* Wrap the app inside FormProvider */}
        <App />
      </FormProvider>
    </BrowserRouter>
  </StrictMode>
);
