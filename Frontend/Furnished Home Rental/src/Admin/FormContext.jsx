import { createContext, useState, useContext, useEffect } from "react";
import { sendFormData, fetchItemss, blockDates, getBlockedDates, unblockDates } from "./Api/ManageitemsAPI";
import { fetchUsersStats, fetchItemsStats } from "./Api/DashboardApi";
import { fetchUsers, deleteUser, updateUserRole } from "./Api/UsersApi";
import { message } from 'antd'; // Import message from antd

// Create Context
const FormContext = createContext();

// Custom Hook for using Context
export const useFormContext = () => useContext(FormContext);

// Context Provider Component
export const FormProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("basic"); // Default tab
  const [formData, setFormData] = useState({}); // Stores form input values
  const [items, setItems] = useState([]); // Stores fetched items
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched
  const [dashboardData, setDashboardData] = useState({ users: 0, items: 0 }); // Stores dashboard data
  const [users, setUsers] = useState([]); // Stores fetched users
  const [blockedDates, setBlockedDates] = useState([]); // Stores blocked dates

  // Fetch data from backend when the app loads
  useEffect(() => {
    if (!dataFetched) {
      fetchItems();
      fetchBlockedDates();
    }
  }, [dataFetched]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItemss(); // API call to get items
      setItems(data || []); // Store retrieved items
      setDataFetched(true); // Set data fetched to true
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
    setLoading(false);
  };

  const fetchBlockedDates = async () => {
    try {
      const data = await getBlockedDates();
      setBlockedDates(data);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const usersData = await fetchUsersStats();
      const itemsData = await fetchItemsStats();
      setDashboardData({
        users: usersData.usersCount,
        items: itemsData.itemsCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      console.log("Fetching users data...");
      const data = await fetchUsers(); // API call to get users
      setUsers(data || []); // Store retrieved users
      console.log("Fetched users data:", data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteUser(id);
      if (response.success) {
        message.success(response.message);
        setUsers(users.filter(user => user._id !== id));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while deleting the user.");
    }
  };

  const handleUpdateUserRole = async (id, role) => {
    try {
      const response = await updateUserRole(id, role);
      if (response.success) {
        message.success(response.message);
        setUsers(users.map(user => user._id === id ? { ...user, role } : user));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while updating the user role.");
    }
  };

  const handleBlockDates = async (propertyId, startDate, endDate) => {
    try {
      const response = await blockDates(propertyId, startDate, endDate);
      message.success(response.message);
      setBlockedDates([...blockedDates, { propertyId, startDate, endDate }]);
    } catch (error) {
      message.error("An error occurred while blocking the dates.");
      console.log("error while blocking date : ", error);
    }
  };

  const handleUnblockDates = async (propertyId, startDate, endDate) => {
    try {
      const response = await unblockDates(propertyId, startDate, endDate);
      message.success(response.message);
      setBlockedDates(blockedDates.filter(date => !(date.propertyId === propertyId && date.startDate === startDate && date.endDate === endDate)));
    } catch (error) {
      message.error("An error occurred while unblocking the dates.");
    }
  };

  const submitFormData = async () => {
    setSubmissionError("");
    setSubmissionMessage("");
    try {
      const result = await sendFormData({
        ...formData,
        pricing: {
          pricePerNight: formData.pricePerNight,
          pricePerWeek: formData.pricePerWeek,
          pricePerMonth: formData.pricePerMonth,
          weeklyDiscount: formData.weeklyDiscount,
          monthlyDiscount: formData.monthlyDiscount,
        },
      });
      if (result.message) {
        setSubmissionMessage(result.message);
        fetchItems(); // Refresh list after adding
      } else {
        setSubmissionError("Failed to submit form data. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setSubmissionError("Failed to submit form data. Please try again later.");
    }
  };

  const updateFormData = (updatedFields) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedFields,
    }));
  };

  return (
    <FormContext.Provider value={{ 
      activeTab, setActiveTab, 
      formData, setFormData, submitFormData, 
      items, loading, fetchItems,
      submissionError, submissionMessage,
      updateFormData, dataFetched, setDataFetched,
      dashboardData, fetchDashboardData,
      users, fetchUsersData, handleDeleteUser, handleUpdateUserRole,
      blockedDates, handleBlockDates, handleUnblockDates
    }}>
      {children}
    </FormContext.Provider>
  );
};
