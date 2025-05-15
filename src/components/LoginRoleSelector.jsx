import React, { useState } from "react";
import '../styles/auth/components/role-selector.css'; 

const LoginRoleSelector = ({ onSelect }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleSelect = (role) => {
    setSelectedRole(role);
    if (onSelect) {
      onSelect(role);
    }
  };

  return (
    <div className="role-selector">
      <div
        className={`circle ${selectedRole === "admin" ? "selected" : ""}`}
        onClick={() => handleSelect("admin")}
      >
        Admin
      </div>
      <div
        className={`circle ${selectedRole === "book_owner" ? "selected" : ""}`}
        onClick={() => handleSelect("book_owner")}
      >
        Book Owner
      </div>
      <div
        className={`circle ${selectedRole === "reader" ? "selected" : ""}`}
        onClick={() => handleSelect("reader")}
      >
        Reader
      </div>
    </div>
  );
};

export default LoginRoleSelector;