import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./User/MainPages/Home";
import Contactus from "./User/Components/Contactus";
import Login from "./User/UserAuth/LoginPage";
import Dashboard from "./Admin/Dashboard/Dashboard";
import ManageItems from "./Admin/ManageItems/ManageItems";
import ProtectedRoute from "./User/Auth/protectedroute";
import DisplayPage from "./Admin/ManageItems/DisplayPage";
import UpdateForm from "./Admin/ManageItems/ManageitemsComponents/UpdateForm";
import Signup from "./User/UserAuth/signup";
import VerifyEmail from "./User/UserAuth/verifyEmail";
import { VerifyEmailProvider } from './User/UserAuth/VerifyEmailContext';
import Profile from './User/Components/profile';
import { UserProvider } from './User/Context/UserContext';
import ResetPassword from './User/UserAuth/resetpassword';
import ManageUsers from './Admin/ManageUsers/ManageUsers';
import { FormProvider } from './Admin/FormContext';
import PropertyDetails from './User/Components/PropertyDetails';
import ErrorBoundary from './ErrorBoundary';
import Layout from './User/Components/Layout';
import Checkout from "./User/Auth/checkout";
import ReservationsPage from "./Admin/ManageItems/ManageReservations/reservations";
import FeaturedProperties from "./User/Components/FeaturedProperties";
import OurCollections from "./User/Components/ourcollections";
import AboutUs from "./User/Components/aboutus";
import { PropertyContext } from "./User/Context/HomeContext";
import { fetchProperties } from "./User/Components/API/HomeCardData";
import ContactsPage from "./Admin/ManageContacts/contacts";

const App = () => {
  // Add PropertyContext state at the top level so it persists across navigation
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Optionally, fetch properties once here if you want to pre-load
  // useEffect(() => {
  //   if (properties.length === 0) {
  //     setLoading(true);
  //     fetchProperties().then(data => {
  //       setProperties(data);
  //       setLoading(false);
  //     });
  //   }
  // }, []);

  return (
    <VerifyEmailProvider>
      <UserProvider>
        <FormProvider>
          <PropertyContext.Provider value={{ properties, setProperties, loading, setLoading }}>
            <ErrorBoundary>
              {/* <Router> */}
                <Routes>
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/contactus" element={<Layout><Contactus /></Layout>} />
                  {/* verification */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify" element={<VerifyEmail/>} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/resetpassword" element={<ResetPassword />} />
                  
                  {/* Admin */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ManageItems" element={<ManageItems />} />
                    <Route path="/showitems" element={<DisplayPage />} />
                    <Route path="/update" element={<UpdateForm />} />
                    <Route path="/manageusers" element={<ManageUsers/>}/>
                    <Route path="/ManageReservations" element={<ReservationsPage />} />
                    <Route path="/ManageContacts" element={<ContactsPage />} />
                  </Route>

                  {/* Property Details */}
                  <Route path="/property/:id" element={<PropertyDetails />} />
                  {/* Checkout */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/reservations/:propertyId" element={<ReservationsPage />} />
                  <Route path="/featured" element={<Layout><FeaturedProperties /></Layout>} />
                  <Route path="/ourcollections" element={<Layout><OurCollections /></Layout>} />
                  <Route path="/about" element={<Layout><AboutUs /></Layout>} />
                </Routes>
              {/* </Router> */}
            </ErrorBoundary>
          </PropertyContext.Provider>
        </FormProvider>
      </UserProvider>
    </VerifyEmailProvider>
  );
};

export default App;