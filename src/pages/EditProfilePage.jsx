import React, { useState, useEffect } from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import EditButton from '../components/EditButton';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';
import { useEffect } from 'react';




function EditProfilePage() {

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       authService.refreshTokenIfNeeded();
    //     }, 60000); // Check every 60 seconds
    
    //     return () => clearInterval(interval);
    //   }, []);

    const [userName, setUserName] = useState('username');
    const [password, setPassword] = useState('Password');
    const [email, setEmail] = useState('Email');
    const [phoneNumber, setPhoneNumber] = useState('PhoneNumber');

    const handleSaveUserName = (newValue) => {
        setUserName(newValue || userName);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem("token"));
                console.log("Token Data:", tokenData);

                if (!tokenData || !tokenData.role) {
                    setError("User not logged in. Redirecting to login...");
                    setTimeout(() => navigate('/login'), 2000);
                    setLoading(false);
                    return;
                }

                setRole(tokenData.role);
                let profileResponse;

                if (tokenData.role === "book_owner") {
                    const bookOwnerID = tokenData.bookOwnerID;
                    console.log("Fetching profile for Book Owner ID:", bookOwnerID);
                    if (!bookOwnerID) {
                        throw new Error("Book Owner ID not found");
                    }
                    setUserId(bookOwnerID);
                    try {
                        profileResponse = await authService.fetchBookOwnerProfile(bookOwnerID);
                        setName(profileResponse.bookOwnerName || tokenData.bookOwnerName || '');
                        setEmail(profileResponse.email || '');
                        setPhoneNumber(profileResponse.phoneNumber || '');
                    } catch (err) {
                        console.warn("Failed to fetch book owner profile, using token data as fallback:", err.message);
                        setName(tokenData.bookOwnerName || '');
                        setEmail('');
                        setPhoneNumber('');
                    }
                } else if (tokenData.role === "reader") {
                    const readerID = tokenData.readerID;
                    console.log("Fetching profile for Reader ID:", readerID);
                    if (!readerID) {
                        throw new Error("Reader ID not found");
                    }
                    setUserId(readerID);
                    try {
                        profileResponse = await authService.fetchReaderProfile(readerID);
                        setName(profileResponse.readerName || tokenData.readerName || '');
                        setEmail(profileResponse.email || tokenData.readerEmail || '');
                        setPhoneNumber(profileResponse.phoneNumber || '');
                    } catch (err) {
                        console.warn("Failed to fetch reader profile, using token data as fallback:", err.message);
                        setName(tokenData.readerName || '');
                        setEmail(tokenData.readerEmail || '');
                        setPhoneNumber('');
                    }
                } else {
                    throw new Error("Invalid user role");
                }

                setPassword('');
                setLoading(false);
            } catch (err) {
                setError("Failed to load profile: " + err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleSaveName = async (newValue) => {
        const updatedValue = newValue || name;
        setName(updatedValue);
        await saveProfile(
            role === "book_owner" ? { bookOwnerName: updatedValue } : { readerName: updatedValue }
        );
    };

    const handleSavePassword = async (newValue) => {
        const updatedValue = newValue || password;
        setPassword(updatedValue);
        await saveProfile({ password: updatedValue });
    };

    const handleSaveEmail = async (newValue) => {
        const updatedValue = newValue || email;
        setEmail(updatedValue);
        await saveProfile({ email: updatedValue });
    };

    const handleSavePhoneNumber = async (newValue) => {
        const updatedValue = newValue || phoneNumber;
        setPhoneNumber(updatedValue);
        await saveProfile({ phoneNumber: updatedValue });
    };

    const saveProfile = async (updatedField) => {
        try {
            if (!userId || !role) {
                setError("User not logged in or role not defined.");
                return;
            }

            const updatedProfile = {
                ...(role === "book_owner" ? { bookOwnerName: name } : { readerName: name }),
                password: password || '', // Always send password, even if empty
                email: email,
                phoneNumber: phoneNumber || undefined
            };

            const profileToSend = { ...updatedProfile, ...updatedField };

            if (!profileToSend[role === "book_owner" ? "bookOwnerName" : "readerName"] || !profileToSend.email) {
                setError("Name and email are required.");
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileToSend.email)) {
                setError("Please enter a valid email address.");
                return;
            }

            console.log("Sending payload to API:", profileToSend);

            if (role === "book_owner") {
                await authService.updateBookOwnerProfile(userId, profileToSend);
            } else if (role === "reader") {
                await authService.updateReaderProfile(userId, profileToSend);
            }

            setSuccess("Profile updated successfully!");
            setError(null);
            setTimeout(() => {
                setSuccess(null);
                navigate(role === "book_owner" ? '/BookOwnerPage' : '/ReaderPage');
            }, 2000);
        } catch (err) {
            setError("Failed to update profile: " + err.message);
            setSuccess(null);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <TopBar />
            <UserName />
            {success && <div className="success">{success}</div>}
            <h1 className="NameAtEditProfile">{role === "book_owner" ? "Book Owner Name" : "Reader Name"}: {name || 'Not set'}</h1>
            <EditButton onSave={handleSaveName} /><br />
            <h1 className="PasswordAtEditProfile">Password: {password ? '********' : 'Not set'}</h1>
            <EditButton onSave={handleSavePassword} /><br />
            <h1 className="EmailAtEditProfile">Email: {email || 'Not set'}</h1>
            <EditButton onSave={handleSaveEmail} /><br />
            <h1 className="PhoneNumberAtEditProfile">Phone Number: {phoneNumber || 'Not set'}</h1>
            <EditButton onSave={handleSavePhoneNumber} />
            <div className="form-actions">
                <button className="cancel-button" onClick={() => navigate(role === "book_owner" ? '/BookOwnerPage' : '/ProfilePage')}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditProfilePage;