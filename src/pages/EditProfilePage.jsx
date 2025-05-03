import React, { useState } from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import EditButton from '../components/EditButton';
import authService from '../services/auth.service';
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
    };

    const handleSavePassword = (newValue) => {
        setPassword(newValue || password);
    };

    const handleSaveEmail = (newValue) => {
        setEmail(newValue || email);
    };

    const handleSavePhoneNumber = (newValue) => {
        setPhoneNumber(newValue || phoneNumber);
    };

    return (
        <>
            <TopBar />
            <UserName />
                <h1 className="UserNameAtEditProfile">User Name: {userName}</h1>
                <EditButton onSave={handleSaveUserName} /><br></br>
                <h1 className="PasswordAtEditProfile">Password: {password}</h1>
                <EditButton onSave={handleSavePassword} /><br></br>
                <h1 className="EmailAtEditProfile">Email: {email}</h1>
                <EditButton onSave={handleSaveEmail} /><br></br>
                <h1 className="PhoneNumberAtEditProfile">PhoneNumber: {phoneNumber}</h1>
                <EditButton onSave={handleSavePhoneNumber} />
        </>
    );
}

export default EditProfilePage;