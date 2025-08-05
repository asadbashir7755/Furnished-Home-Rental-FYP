import React, { useState, useEffect } from 'react';
import { resetPassword } from './userAuthApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import './ResetPassword.css'; // Assuming you have a CSS file for styling

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location]);

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }
        try {
            const response = await resetPassword(token, newPassword);
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <Form layout="vertical" onFinish={handleResetPassword}>
                <Form.Item label="New Password" required>
                    <Input.Password
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Confirm Password" required>
                    <Input.Password
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
