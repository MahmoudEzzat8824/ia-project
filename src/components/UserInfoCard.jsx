import { useEffect, useState } from "react";
import authService from "../services/auth.service";

export default function UserInfoCard() {
  const [readerDetails, setReaderDetails] = useState({
    readerId: null,
    readerName: null,
    readerEmail: null,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const details = authService.getReaderDetails();
      setReaderDetails(details);
    }, 1000); // refresh every 1 second

    return () => clearInterval(intervalId); // clean up interval when component unmounts
  }, []);

  return (
    <div className="user-info-card">
  {readerDetails.readerId ? (
    <div className="text-xs font-semibold">
      <p className="username-welcome">Welcome {readerDetails.readerName}</p>
      <p className="userId-welcome">Your Id is : {readerDetails.readerId}</p> 
      <p className="useEmailr-welcome">Email : {readerDetails.readerEmail}</p>  
      
    </div>
  ) : (
    <div className="text-xs font-semibold">Not logged in</div>
  )}
</div>

  );
}
