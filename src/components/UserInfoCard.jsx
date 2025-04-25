import React from "react";

const UserInfoCard = ({ user }) => {
  if (!user) {
    return (
      <div className="user-container">
        <p>You are not logged in.</p>
        <a href="/"><button>Login</button></a>
      </div>
    );
  }

  const { role, user: userInfo } = user;

  return (
    <div className="user-container">
      <h3>Logged in as {role}</h3>
      {role === "admin" && <p>Admin Name: {userInfo.adminName}</p>}
      {role === "book_owner" && (
        <>
          <p>Name: {userInfo.bookOwnerName}</p>
          <p>Email: {userInfo.email}</p>
          <p>Phone: {userInfo.phoneNumber}</p>
        </>
      )}
      {role === "reader" && (
        <>
          <p>Name: {userInfo.readerName}</p>
          <p>Email: {userInfo.email}</p>
        </>
      )}
    </div>
  );
};

export default UserInfoCard;
