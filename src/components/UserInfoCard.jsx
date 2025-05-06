import { useEffect, useState } from "react";
import authService from "../services/auth.service";
import '../Styles/UserInfoCard.css'

export default function UserInfoCard() {
  const [readerDetails, setReaderDetails] = useState({
    readerId: null,
    readerName: null,
    readerEmail: null,
  });
  const [bookOwnerDetails, setBookOwnerDetails] = useState({
    bookOwnerId: null,
    bookOwnerName: null,
  });

  useEffect(() => {
    // Log token for debugging
    const token = localStorage.getItem("token");
    console.log("UserInfoCard - token:", token);

    // Fetch details
    const details = authService.getReaderDetails();
    const ownerDetails = authService.getBookOwnerDetails();
    
    console.log("UserInfoCard - readerDetails:", details);
    console.log("UserInfoCard - bookOwnerDetails:", ownerDetails);

    setReaderDetails(details);
    setBookOwnerDetails(ownerDetails);

    // No need for interval unless token changes dynamically
  }, []); // Run once on mount

  return (
    <div className="user-info-card">
      {readerDetails.readerId ? (
        <div className="text-xs font-semibold">
          <p className="username-welcome">Welcome {readerDetails.readerName}</p>
          <p className="userId-welcome">Your Id is: {readerDetails.readerId}</p>
          <p className="useEmailr-welcome">Email: {readerDetails.readerEmail}</p>
        </div>
      ) : bookOwnerDetails.bookOwnerId ? (
        <div className="text-xs font-semibold">
          <p className="username-welcome">Welcome {bookOwnerDetails.bookOwnerName}</p>
          <p className="userId-welcome">Your Id is: {bookOwnerDetails.bookOwnerId}</p>
        </div>
      ) : (
        <div className="text-xs font-semibold">Not logged in</div>
      )}
    </div>
  );
}