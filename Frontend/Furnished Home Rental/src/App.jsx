import React from 'react';
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

const App = () => {
  return (
    <VerifyEmailProvider>
      <UserProvider>
        <FormProvider>
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
                </Route>

                {/* Property Details */}
                <Route path="/property/:id" element={<PropertyDetails />} />
              </Routes>
            {/* </Router> */}
          </ErrorBoundary>
        </FormProvider>
      </UserProvider>
    </VerifyEmailProvider>
  );
};

export default App;