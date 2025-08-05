import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const loginUser = async (formData) => {
  return await API.post(`${API_BASE_URL}/users/login`, formData);
};

export const registerUser = async (formData) => {
  return await API.post(`${API_BASE_URL}/users/register`, formData);
};

export const sendVerificationEmail = async (email) => {
  return await API.post(`${API_BASE_URL}/users/send-verification-email`, { email });
};

export const sendForgotPasswordEmail = async (email) => {
  return await API.post(`${API_BASE_URL}/users/forgot-password`, { email });
};

export const resetPassword = async (token, newPassword) => {
  return await API.post(`${API_BASE_URL}/users/reset-password`, { token, newPassword });
};

export const verifyEmail = async (formData, verificationCode) => {
  return await API.post(`${API_BASE_URL}/users/verify-email`, { ...formData, verificationCode });
};

export const logoutUser = async () => {
  return await API.post(`${API_BASE_URL}/users/logout`);
};
