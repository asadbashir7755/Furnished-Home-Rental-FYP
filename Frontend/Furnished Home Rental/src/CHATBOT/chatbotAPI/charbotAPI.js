import API from "../../utils/axios";
import { API_BASE_URL } from "../../../config/apiconfig";

export const sendMessageToBot = async (message) => {
  const res = await API.post(`${API_BASE_URL}/chatbot/message`, { message });
  console.log("Response from chatbot API:", res.data); // Debugging line
  return res.data;
};
